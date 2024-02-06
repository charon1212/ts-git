import { GitPath } from "../gitPath";
import { Gitignore, GitignorePattern } from "./Gitignore";
import { existsSync, readFileSync } from 'fs';

export const loadGitignore = (gitPath: GitPath): Gitignore => {
  const gitignore: Gitignore = { sources: [], };

  // TODO: いったんルートの.gitignoreファイルからの読み込みのみとする。他のソース（下位ディレクトリの.gitignoreや、.git/info/exclude等）は後で実装。
  const gitignoreFilePath = `${gitPath.rootPath}/.gitignore`;
  if (existsSync(gitignoreFilePath)) {
    const patterns = readGitignoreFile(readFileSync(gitignoreFilePath).toString());
    gitignore.sources.push({ priority: 2, prefix: '', patterns });
  }

  return gitignore;
};

const readGitignoreFile = (str: string): GitignorePattern[] => {
  const lines = str.split('\r\n').map((line) => line.split('\n')).reduce((p, c) => [...p, ...c], []);
  return lines.map((line) => parseGitignorePattern(line)).filter((pattern): pattern is GitignorePattern => pattern !== null);
};

const parseGitignorePattern = (patternStr: string): GitignorePattern | null => {
  const source = patternStr;

  if (patternStr.trim() === '') return null; // 空白行は無視
  if (patternStr.startsWith('#')) return null; // コメント行は無視

  /** 
   * 空白取り除き
   * FIXME: 先頭の空白は取り除かないべき。また、末尾の空白を取り除くが、「\」でエスケープされた空白は取り除かないべき。面倒なのでいったんこれ。
   */
  patternStr = patternStr.trim();

  /** 空白行は無視 */
  if (patternStr.trim() === '') return null;
  /** コメント行は無視 */
  if (patternStr.startsWith('#')) return null;
  /** 先頭の否定「!」を判定 */
  const not = patternStr.startsWith('!');
  if (not) patternStr = patternStr.slice(1);
  /** 末尾の「/」を判定 */
  const isOnlyDirectory = patternStr.endsWith('/');
  if (isOnlyDirectory) patternStr = patternStr.slice(0, -1);
  /** 途中に「/」がある、相対パス判定のパターンであるかを判定 */
  const relative = patternStr.includes('/');

  return { not, isOnlyDirectory, relative, source, exp: patternStr };
};
