import { join, resolve } from 'path';
import { GitHash } from './gitObject/gitObject';
import { Result, er, ok } from '../util/SimpleResult';
import { existsSync } from 'fs';
import { TsGitPath } from './filePath/TsGitPath';

/**
 * Gitが内部で利用するファイルのパスなどをまとめたクラス。
 */
export class GitPath {
  /** Gitリポジトリのパス。このパスは文字列で保持し、TsGitPathを使わないこと。（TsGitPathがこのrootDirを使って変換しているため、循環参照になる。） */
  public readonly rootAbsPath: string;
  public readonly root: TsGitPath;
  private readonly dotgit: TsGitPath;
  constructor(root?: string) {
    this.rootAbsPath = root ?? findGitRepository(process.cwd()).unwrap();
    this.root = TsGitPath.fromRep(this);
    this.dotgit = TsGitPath.fromRep(this, '.git');
  }
  fromHash(gitHash: GitHash) {
    return this.dotgit.child('objects', gitHash.slice(0, 2), gitHash.slice(2));
  }
  get git() {
    return {
      path: this.dotgit,
      objects: {
        path: this.dotgit.child('objects'),
      },
      HEAD: {
        path: this.dotgit.child('HEAD'),
      },
      index: {
        path: this.dotgit.child('index'),
      },
    };
  }
}

/**
 * 引数のディレクトリを起点に親ディレクトリをたどり、Gitリポジトリを探す。
 */
const findGitRepository = (dirPath: string): Result<string, string> => {
  if (existsSync(join(dirPath, ".git"))) return ok(dirPath);
  const parent = resolve(dirPath, "..");
  return dirPath === parent ? er('Gitリポジトリが存在しません。') : findGitRepository(parent);
};

export const gitPath = new GitPath();
