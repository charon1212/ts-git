import { sha1Length } from "../../util/sha1";
import { GitHash, createGitHash } from "./gitObject";

export type GitObjectTree = { type: 'tree', content: GitObjectTreeContent };

export type GitObjectTreeContent = GitObjectTreeEntry[];
export type GitObjectTreeEntry = {
  /** ファイル/ディレクトリのモード。基本的に、ファイルなら100644、ディレクトリなら040000（状況次第だけど…） */
  mode: string,
  /** 参照先のGitObjectのハッシュ値 */
  hash: GitHash,
  /** 参照先の名前 */
  name: string,
};

export const createGitObjectTreeContent = (object: GitObjectTree) => Buffer.from(object.content.map(({ mode, hash, name }) => `${mode} ${name}\0${hash}`).join(''));

export const parseGitObjectTreeContent = (buf: Buffer): GitObjectTreeContent => {
  const content: GitObjectTreeContent = [];
  let index = 0;

  while (index < buf.length) {
    const indexSpace = buf.indexOf(' ', index);
    if (indexSpace < 0) throw new Error('不正なTreeObjectのContent。spaceがありません。');
    const indexNull = buf.indexOf('\0', index);
    if (indexNull < 0) throw new Error('不正なTreeObjectのContent。nullがありません。');
    const mode = buf.subarray(index, indexSpace).toString();
    const name = buf.subarray(indexSpace + 1, indexNull).toString();
    const hash = createGitHash(buf.subarray(indexNull + 1, indexNull + 1 + sha1Length).toString());
    content.push({ mode, name, hash });

    index = indexNull + 1 + sha1Length;
  }
  return content;
};
