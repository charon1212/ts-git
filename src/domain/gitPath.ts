import { GitHash } from './gitObject/gitObject';
import { Result, er, ok } from '../util/SimpleResult';
import { existsSync } from 'fs';
import { TsGitPath } from './filePath/TsGitPath';
import { myPath } from '../util/MyPath';

/**
 * Gitが内部で利用するファイルのパスなどをまとめたクラス。
 */
export class GitPath {
  /** Gitリポジトリのパス。このパスは文字列で保持し、TsGitPathを使わないこと。（TsGitPathがこのrootDirを使って変換しているため、循環参照になる。） */
  public readonly rootAbsPath: string;
  public readonly root: TsGitPath;
  private readonly dotgit: TsGitPath;
  constructor(root?: string) {
    this.rootAbsPath = root ? myPath.resolve(root) : findGitRepository(process.cwd()).unwrap();
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
        info: { path: this.dotgit.child('objects', 'info') },
        pack: { path: this.dotgit.child('objects', 'pack') },
      },
      HEAD: {
        path: this.dotgit.child('HEAD'),
      },
      index: {
        path: this.dotgit.child('index'),
      },
      refs: {
        path: this.dotgit.child('refs'),
        heads: { path: this.dotgit.child('refs', 'heads') },
        tags: { path: this.dotgit.child('refs', 'tags') },
      },
      config: { path: this.dotgit.child('config') },
      description: { path: this.dotgit.child('description') },
    };
  }
}

/**
 * 引数のディレクトリを起点に親ディレクトリをたどり、Gitリポジトリを探す。
 */
const findGitRepository = (dirPath: string): Result<string, string> => {
  if (existsSync(myPath.join(dirPath, ".git"))) return ok(dirPath);
  const parent = myPath.resolve(dirPath, "..");
  return dirPath === parent ? er('Gitリポジトリが存在しません。') : findGitRepository(parent);
};

export const gitPath = new GitPath();
