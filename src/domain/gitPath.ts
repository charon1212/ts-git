import { join } from 'path';
import { GitHash } from './gitObject/gitObject';

/** 各種パス */
export class GitPath {
  private rootDir = process.cwd();
  constructor(rootDir?: string) {
    if (rootDir) this.rootDir = rootDir;
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
