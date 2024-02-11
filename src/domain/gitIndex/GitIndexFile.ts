import { GitPath, gitPath } from "../gitPath";
import { decodeGitIndex } from "./decodeGitIndex";
import { encodeGitIndex } from "./encodeGitIndex";
import { GitIndex } from "./gitIndex";
import { existsSync, readFileSync, writeFileSync } from 'fs';

/** GitIndexFileを操作するためのクラス */
export class GitIndexFile {
  private index: GitIndex | undefined;
  constructor(private gitPath: GitPath) { };
  private getIndex() {
    if (this.index !== undefined) return this.index;
    const indexPath = this.gitPath.git.index.path.abs;
    const gitIndex = existsSync(indexPath) ? decodeGitIndex(readFileSync(indexPath)).gitIndex : { entries: [] };
    this.index = gitIndex;
    return gitIndex;
  }

  /**
   * GitIndexファイルを読みこみ、更新して保存する。毎回書き込み処理が走るため、一度にUPDATEすること。
   * @param callback 更新内容を示すcallback関数。
   */
  update(callback: (gitIndex: GitIndex) => GitIndex) {
    const indexPath = this.gitPath.git.index.path.abs;
    const newGitIndex = callback(this.getIndex());
    writeFileSync(indexPath, encodeGitIndex(newGitIndex));
    this.index = newGitIndex;
  };
};

export const gitIndexFile = new GitIndexFile(gitPath);
