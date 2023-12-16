import { writeFileSync, readFileSync } from 'fs';
import { GitHash, GitObject, createGitHash, isGitObjectType } from "./gitObject";
import { createSha1 } from "../../util/sha1";
import { createGitObjectBlobContent, parseGitObjectBlobContent } from "./gitObjectBlob";
import { createGitObjectTreeContent, parseGitObjectTreeContent } from "./gitObjectTree";
import { createGitObjectCommitContent, parseGitObjectCommitContent } from "./gitObjectCommit";
import { getGitPathFromHash } from '../gitPath';
import { unzip, zip } from '../../util/gzip';

/**
 * GitObjectのKey-Value型データストアの実装。
 * Gitではほぼ全てのデータをGitObjectとして、「.git/objects」配下に保存する。
 * 本クラスは、新たなデータを追加してそのハッシュ値を取得するaddメソッドと、ハッシュ値からデータを取得するreadメソッドを実装する。
 * TODO: deleteが必要かどうかは要調査…
 */
class GitObjectDataStore {
  async add(object: GitObject): Promise<GitHash> {
    const content = getGitObjectContent(object);
    const data = object.type + " " + content.length + "\0" + content;
    const sha1 = createSha1(data);
    const gitHash = createGitHash(sha1);

    // 保存処理
    const zipData = await zip(Buffer.from(data));
    const path = getGitPathFromHash(gitHash);
    writeFileSync(path, zipData);

    return gitHash;
  }

  async read(gitHash: GitHash): Promise<GitObject> {
    const path = getGitPathFromHash(gitHash);
    const zipData = readFileSync(path);
    const unzipData = await unzip(zipData);

    const indexSpace = unzipData.indexOf(' ');
    if (indexSpace < 0) throw new Error('gitObjectのフォーマットエラー(半角スペースなし)');
    const indexNull = unzipData.indexOf('\0');
    if (indexNull < 0) throw new Error('gitObjectのフォーマットエラー(ヌル文字なし)');

    const typeBuf = unzipData.subarray(0, indexSpace);
    const contentBuf = unzipData.subarray(indexNull + 1);

    // type
    const type = typeBuf.toString();
    if (!isGitObjectType(type)) throw new Error('gitObjectのフォーマットエラー(不明なtype)');

    if (type === 'blob') return { type, content: parseGitObjectBlobContent(contentBuf) };
    if (type === 'tree') return { type, content: parseGitObjectTreeContent(contentBuf) };
    if (type === 'commit') return { type, content: parseGitObjectCommitContent(contentBuf) };
    throw new Error(`未定義のGitObjectType:` + type);
  }
};

const getGitObjectContent = (object: GitObject): string | Buffer => {
  const { type } = object;
  if (type === 'blob') return createGitObjectBlobContent(object);
  if (type === 'tree') return createGitObjectTreeContent(object);
  if (type === 'commit') return createGitObjectCommitContent(object);
  throw new Error(`未定義のGitObjectType:` + type);
};

export const gitObjectDataStore = new GitObjectDataStore();
