import { lstatSync, readdirSync } from "fs";
import { isIgnore } from "../gitignore/isIgnore";
import { Gitignore } from "../gitignore/Gitignore";
import { GitPath } from "../gitPath";
import { TsGitPath } from "./TsGitPath";

/**
 * gitリポジトリ内のファイルの内、gitignoreで除外されていない全てのファイルのパスを取得する。
 */
export const getAllNotIgnoreFilePath = (gitPath: GitPath, gitignore: Gitignore): TsGitPath[] => {
  return getFilePathList(gitPath.root, gitignore);
};

/**
 * rootから再帰的に探索してファイルパスの一覧を取得する。
 *
 * @param dirPath ディレクトリの絶対パス。
 * @param gitignore Gitignore。
 * @param array 再帰呼び出し用のため、外部呼出し時は省略。
 * @returns ファイルパス情報の一覧。pathは絶対パス。
 */
const getFilePathList = (dirPath: TsGitPath, gitignore: Gitignore, array: TsGitPath[] = []): TsGitPath[] => {
  const items = readdirSync(dirPath.abs);
  for (let item of items) {
    const itemPath = dirPath.child(item);
    if (isIgnoreAlways(itemPath)) continue;
    const stat = lstatSync(itemPath.abs);
    if (stat.isDirectory()) {
      if (!isIgnore(itemPath, gitignore, true)) getFilePathList(itemPath, gitignore, array);
    } else {
      if (!isIgnore(itemPath, gitignore, false)) array.push(itemPath);
    }
  }
  return array;
};

const isIgnoreAlways = (path: TsGitPath) => {
  if (path.basename() === '.git') return true;
  return false;
};
