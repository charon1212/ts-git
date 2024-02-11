import { Command } from "commander";
import { gitPath } from "../../domain/gitPath";
import { loadGitignore } from "../../domain/gitignore/loadGitignore";
import { getAllNotIgnoreFilePath } from "../../domain/filePath/getAllNotIgnoreFilePath";
import { gitIndexFile } from "../../domain/gitIndex/GitIndexFile";
import { createGitIndexEntry } from "../../domain/gitIndex/createGitIndexEntry";
import { GitObjectBlob } from "../../domain/gitObject/gitObjectBlob";
import { readFileSync } from 'fs';
import { gitObjectDataStore } from "../../domain/gitObject/GitObjectDataStore";

export const commander_add = (command: Command) => {
  command
    .command('add')
    .argument('<pathspec...>')
    .option('-t, --test <test>', 'test') // 将来オプションをはやすときのためのサンプル。
    .action(async (...args: ExploreOptions) => {
      await add(args);
    });
};

type ExploreOptions = [string[], { test: string }];
const add = async ([pathspecStrList, { test }]: ExploreOptions) => {
  console.warn('現在、pathspecによる制限は未実装です。すべてのファイルについてindexを更新します。');
  const gitignore = loadGitignore(gitPath);
  const filePathList = getAllNotIgnoreFilePath(gitPath, gitignore);
  /**
   * TODO: ここら辺、いろんな要素が未考慮なので直したい。
   * - pathspecによる制限を行っていないため、リポジトリ配下の全ファイルが対象になっている。
   * - 問答無用で前のindexを破棄して塗り替えている。
   * - 更新されたファイルのみ処理するとかない。後、毎回GitBlobObjectを作り直している。
   */
  const gitIndexEntries = await Promise.all(filePathList.map(async (filePath) => {
    const gitObjectBlob: GitObjectBlob = { type: 'blob', content: readFileSync(filePath.abs) };
    const hash = await gitObjectDataStore.add(gitObjectBlob);
    return createGitIndexEntry(filePath, hash, 'regular')
  }));
  gitIndexFile.update(() => ({ entries: gitIndexEntries, }));

};
