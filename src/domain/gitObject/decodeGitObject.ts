import { GitObject, isGitObjectType } from "./gitObject";
import { parseGitObjectBlobContent } from "./gitObjectBlob";
import { parseGitObjectCommitContent } from "./gitObjectCommit";
import { parseGitObjectTreeContent } from "./gitObjectTree";

export const decodeGitObject = (buf: Buffer): GitObject => {
  const indexSpace = buf.indexOf(' ');
  if (indexSpace < 0) throw new Error('gitObjectのフォーマットエラー(半角スペースなし)');
  const indexNull = buf.indexOf('\0');
  if (indexNull < 0) throw new Error('gitObjectのフォーマットエラー(ヌル文字なし)');

  const typeBuf = buf.subarray(0, indexSpace);
  const contentBuf = buf.subarray(indexNull + 1);

  // type
  const type = typeBuf.toString();
  if (!isGitObjectType(type)) throw new Error('gitObjectのフォーマットエラー(不明なtype)');

  if (type === 'blob') return { type, content: parseGitObjectBlobContent(contentBuf) };
  if (type === 'tree') return { type, content: parseGitObjectTreeContent(contentBuf) };
  if (type === 'commit') return { type, content: parseGitObjectCommitContent(contentBuf) };
  throw new Error(`未定義のGitObjectType:` + type);
};
