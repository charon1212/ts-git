import { GitPath } from "../gitPath";
import { decodeGitIndex } from "./decodeGitIndex";
import { encodeGitIndex } from "./encodeGitIndex";
import { GitIndex } from "./gitIndex";
import { existsSync, readFileSync, writeFileSync } from 'fs';

/** GitIndexFileを操作するためのクラス */
export class GitIndexFile {
  constructor(private gitPath: GitPath) { };

  private _index: GitIndex | undefined;
  get index(): GitIndex { return this._index || this.readIndex(); }
  set index(value: GitIndex) { this._index = value; }

  private readIndex(): GitIndex {
    const indexPath = this.gitPath.git.index.path.abs;
    return this._index = existsSync(indexPath) ? decodeGitIndex(readFileSync(indexPath)).gitIndex : { entries: [] };
  }

  /**
   * GitIndexファイルを読みこみ、更新して保存する。毎回書き込み処理が走るため、一度にUPDATEすること。
   * @param callback 更新内容を示すcallback関数。
   * @deprecated read & write を利用してください。
   */
  update(callback: (gitIndex: GitIndex) => GitIndex) {
    const indexPath = this.gitPath.git.index.path.abs;
    const newGitIndex = callback(this.index);
    writeFileSync(indexPath, encodeGitIndex(newGitIndex));
    this._index = newGitIndex;
  };

  /** Indexファイルから読み込み、本クラスのフィールドを書き換える。 */
  read() {
    this.readIndex();
    return this;
  }
  /** Indexファイルを保存する。保存前にsortを実行するため注意すること。 */
  write() {
    this.sort();
    const indexPath = this.gitPath.git.index.path.abs;
    writeFileSync(indexPath, encodeGitIndex(this.index));
    return this;
  }
  /** Indexをpathnameの昇順に並び替える。 */
  sort() {
    this._index?.entries.sort((a, b) => a.pathName.localeCompare(b.pathName));
    return this;
  }

};
