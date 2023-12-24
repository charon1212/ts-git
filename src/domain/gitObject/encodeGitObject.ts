import { createSha1 } from "../../util/sha1";
import { GitObject, createGitHash } from "./gitObject";
import { createGitObjectBlobContent } from "./gitObjectBlob";
import { createGitObjectCommitContent } from "./gitObjectCommit";
import { createGitObjectTreeContent } from "./gitObjectTree";

export const encodeGitObject = (gitObject: GitObject) => {
  const content = getGitObjectContent(gitObject);
  const data = Buffer.concat([
    Buffer.from(gitObject.type),
    Buffer.from(' '),
    Buffer.from(`${content.length}`),
    Buffer.from('\0'),
    content,
  ]);
  return {
    gitHash: createGitHash(createSha1(data)),
    buffer: Buffer.from(data),
  };
};

const getGitObjectContent = (object: GitObject): Buffer => {
  const { type } = object;
  if (type === 'blob') return createGitObjectBlobContent(object);
  if (type === 'tree') return createGitObjectTreeContent(object);
  if (type === 'commit') return createGitObjectCommitContent(object);
  throw new Error(`未定義のGitObjectType:` + type);
};
