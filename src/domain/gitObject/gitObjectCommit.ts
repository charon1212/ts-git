import { GitHash, createGitHash } from "./gitObject";

export type GitObjectCommit = { type: 'commit', content: GitObjectCommitContent };

export type GitObjectCommitContent = {
  tree: GitHash,
  parents: GitHash[],
  author?: { name: string, email: string, dateSeconds: number, dateTimezone: string, },
  committer?: { name: string, email: string, dateSeconds: number, dateTimezone: string, },
  message: string,
};

export const createGitObjectCommitContent = (object: GitObjectCommit) => {
  const array: string[] = [];
  array.push(`tree ${object.content.tree}`);
  array.push(...object.content.parents.map((hash) => `parent ${hash}`));
  if (object.content.author) {
    const { name, email, dateSeconds, dateTimezone } = object.content.author;
    array.push(`author ${name} <${email}> ${dateSeconds} ${dateTimezone}`);
  }
  if (object.content.committer) {
    const { name, email, dateSeconds, dateTimezone } = object.content.committer;
    array.push(`committer ${name} <${email}> ${dateSeconds} ${dateTimezone}`);
  }
  array.push('');
  array.push(object.content.message);

  return Buffer.from(array.join('\n'));
};

export const parseGitObjectCommitContent = (buf: Buffer): GitObjectCommitContent => {
  let index = 0;
  const content: GitObjectCommitContent = { tree: createGitHash(''), parents: [], message: '' };
  while (true) {
    const indexLf = buf.indexOf('\n', index);
    if (indexLf === -1) break; // 改行が存在しないのは、コミットメッセージが空文字の場合のみ。
    if (indexLf === 0) { // 空行の場合、この行以降はすべてコミットメッセージと判定する。
      content.message = buf.subarray(indexLf + 1).toString();
      break;
    }
    const line = buf.subarray(index, indexLf).toString();
    const indexSpace = buf.indexOf(' ');
    const key = line.slice(0, indexSpace);
    const value = line.slice(indexSpace + 1);

    if (key === 'tree') content.tree = createGitHash(value);
    if (key === 'parent') content.parents.push(createGitHash(value));
    if (key === 'author') content.author = parseCommitterAuthor(value);
    if (key === 'committer') content.committer = parseCommitterAuthor(value);

    index = indexLf + 1;
  }
  return content;
};

const parseCommitterAuthor = (str: string): { name: string, email: string, dateSeconds: number, dateTimezone: string, } => {
  // name
  const indexPreMail = str.indexOf(' <');
  const name = str.slice(0, indexPreMail);
  // email
  const indexPostMail = str.indexOf('> ', indexPreMail);
  const email = str.slice(indexPreMail + 2, indexPostMail);
  // dateSeconds
  const indexSpace = str.indexOf(' ', indexPostMail + 2);
  const dateSeconds = +str.slice(indexPostMail + 2, indexSpace);
  // dateTimezone
  const dateTimezone = str.slice(indexSpace + 1);

  return { name, email, dateSeconds, dateTimezone };
};
