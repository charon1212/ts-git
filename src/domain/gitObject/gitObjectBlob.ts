export type GitObjectBlob = { type: 'blob', content: GitObjectBlobContent };
export type GitObjectBlobContent = Buffer;
export const createGitObjectBlobContent = (object: GitObjectBlob) => object.content;

export const parseGitObjectBlobContent = (buf: Buffer): GitObjectBlobContent => buf;
