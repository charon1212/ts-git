import { join, resolve } from 'path';
import { GitHash } from './gitObject/gitObject';
import { Result, er, ok } from '../util/SimpleResult';
import { existsSync } from 'fs';

/** 各種パス */
export class GitPath {
  private rootDir = process.cwd();
  constructor(rootDir?: string) {
    this.rootDir = rootDir ?? findGitRepository(process.cwd()).unwrap();
  }
  setRoot(rootDir: string) {
    this.rootDir = rootDir;
  }
  get rootPath() {
    return this.rootDir;
  }
  fromHash(gitHash: GitHash) {
    return join(this.rootDir, '.git', 'objects', gitHash.slice(0, 2), gitHash.slice(2));
  }
  get git() {
    return {
      path: join(this.rootDir, '.git'),
      objects: {
        path: join(this.rootDir, '.git', 'objects'),
      },
      HEAD: {
        path: join(this.rootDir, '.git', 'HEAD'),
      },
      index: {
        path: join(this.rootDir, '.git', 'index'),
      },
    };
  }
}
export const gitPath = new GitPath();

/**
 * 引数のディレクトリを起点に親ディレクトリをたどり、Gitリポジトリを探す。
 */
const findGitRepository = (dirPath: string): Result<string, string> => {
  if (existsSync(join(dirPath, ".git"))) return ok(dirPath);
  const parent = resolve(dirPath, "..");
  return dirPath === parent ? er('Gitリポジトリが存在しません。') : findGitRepository(parent);
};
