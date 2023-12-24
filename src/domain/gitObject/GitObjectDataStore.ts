import { writeFileSync, readFileSync } from 'fs';
import { GitHash, GitObject, } from "./gitObject";
import { GitPath, gitPath as defaultGitPath } from '../gitPath';
import { unzip, zip } from '../../util/gzip';
import { decodeGitObject } from './decodeGitObject';
import { encodeGitObject } from './encodeGitObject';

/**
 * GitObjectのKey-Value型データストアの実装。
 * Gitではほぼ全てのデータをGitObjectとして、「.git/objects」配下に保存する。
 * 本クラスは、新たなデータを追加してそのハッシュ値を取得するaddメソッドと、ハッシュ値からデータを取得するreadメソッドを実装する。
 * TODO: deleteが必要かどうかは要調査…
 */
export class GitObjectDataStore {

  private gitPath: GitPath
  constructor(gitPath?: GitPath) {
    this.gitPath = gitPath ?? defaultGitPath;
  };

  async add(gitObject: GitObject): Promise<GitHash> {
    const { buffer, gitHash } = encodeGitObject(gitObject);
    const zipData = await zip(buffer);
    const path = this.gitPath.fromHash(gitHash);
    writeFileSync(path, zipData);
    return gitHash;
  }

  async read(gitHash: GitHash): Promise<GitObject> {
    const path = this.gitPath.fromHash(gitHash);
    const zipData = readFileSync(path);
    const unzipData = await unzip(zipData);
    return decodeGitObject(unzipData);
  }
};

export const gitObjectDataStore = new GitObjectDataStore();
