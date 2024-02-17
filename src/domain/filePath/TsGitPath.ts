import { myPath } from '../../util/MyPath';
import { GitPath } from '../gitPath';

const sepTsGit = '/';
const gregSepOs = new RegExp(`\\${myPath.sep}`, 'g');
const gregSepTsGit = new RegExp(`\\${sepTsGit}`, 'g');

/**
 * ts-git内でパスを扱うためのクラス。
 * 1インスタンスは、Gitリポジトリ内の1つのパスを示す。
 * ※Gitリポジトリのルートディレクトリより上・外のディレクトリ/ファイルパスは扱えない。
 * 以下の表現を統一してコメントで使う。
 *
 * - 絶対パス(absパス): OSで扱う絶対パス。OS標準の区切り文字（Windowsなら\、UNIXなら/）で区切られたパス。
 * - リポジトリパス(repパス): Gitリポジトリからの相対パス。Git標準の区切り文字(/)で区切られたパスで、前後に区切り文字(/)を含まない。
 *
 */
export class TsGitPath {
  private constructor(
    /** repパス。リポジトリルートの場合は空文字。 */
    private readonly repPath: string,
    /** GitPathオブジェクト(リポジトリルートパスを変換で使うため) */
    private readonly gitPath: GitPath,
  ) { }
  /** 絶対パスを取得する */
  get abs(): string {
    if (this.repPath === '') return this.gitPath.rootAbsPath;
    else return this.gitPath.rootAbsPath + myPath.sep + this.repPath.replace(gregSepTsGit, myPath.sep);
  }
  /** Gitリポジトリからの相対パスを取得する。 */
  get rep(): string {
    return this.repPath;
  }

  /** このパスがリポジトリルートのパスであることを判定する。 */
  isRoot() {
    return this.repPath === '';
  }

  /** 親ディレクトリのパスを取得する */
  parent(): TsGitPath {
    if (this.isRoot()) throw new Error('リポジトリルートの親ディレクトリは、TsGitPathの範囲外です。');
    if (this.repPath.includes('/')) return new TsGitPath('', this.gitPath);
    return new TsGitPath(myPath.dirname(this.repPath), this.gitPath);
  }
  /** パスに子要素を追加する */
  child(...paths: string[]): TsGitPath {
    if (this.isRoot()) return TsGitPath.fromRep(this.gitPath, ...paths);
    else return TsGitPath.fromRep(this.gitPath, this.repPath, ...paths);
  }
  /** ファイル名/ディレクトリ名を取得する */
  basename(): string {
    if (this.repPath === '') throw new Error('リポジトリルートのディレクトリ名を取得する操作は許容していません。');
    const index = this.repPath.lastIndexOf(sepTsGit);
    return index === -1 ? this.repPath : this.repPath.slice(index);
  }

  /** 絶対パスから作成する。 */
  static fromAbs(gitPath: GitPath, ...paths: string[]): TsGitPath {
    const path = paths.join(myPath.sep);
    if (path === gitPath.rootAbsPath) return new TsGitPath('', gitPath);
    const pathPrefix = gitPath.rootAbsPath + myPath.sep;
    if (!path.startsWith(pathPrefix)) throw new Error('対象のパスはTsGitPathで扱う対象外です。TsGitPathの対象は常にGitリポジトリ内でなければなりません。(リポジトリルートも禁止)');
    const repPath = path.slice((pathPrefix).length).replace(gregSepOs, sepTsGit);
    return new TsGitPath(repPath, gitPath);
  }
  /** リポジトリ相対パスから作成する。 */
  static fromRep(gitPath: GitPath, ...paths: string[]): TsGitPath {
    const path = paths.join(sepTsGit);
    return new TsGitPath(path, gitPath);
  }
};
