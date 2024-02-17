import { Command } from "commander";
import { gitPath } from "../../domain/gitPath";
import { loadGitignore } from "../../domain/gitignore/loadGitignore";
import { getAllNotIgnoreFilePath } from "../../domain/filePath/getAllNotIgnoreFilePath";
import { GitIndexFile } from "../../domain/gitIndex/GitIndexFile";
import { createGitIndexEntry } from "../../domain/gitIndex/createGitIndexEntry";
import { GitObjectBlob } from "../../domain/gitObject/gitObjectBlob";
import { existsSync, readFileSync } from 'fs';
import { gitObjectDataStore } from "../../domain/gitObject/GitObjectDataStore";
import { parsePathspec } from "../../domain/pathspec/parsePathspec";
import { TsGitPath } from "../../domain/filePath/TsGitPath";
import { GitIndexEntry } from "../../domain/gitIndex/gitIndex";
import { evalPathInPathspec } from "../../domain/pathspec/evalPathspec";

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

  if (pathspecStrList.length === 0) throw new Error('No pathspec specified.');
  const pathspecList = pathspecStrList.map((str) => parsePathspec(str));

  // GitIndexFile初期化
  const gitIndexFile = new GitIndexFile(gitPath);
  gitIndexFile.read();

  // 更新対象のパスリスト
  const updatePath: TsGitPath[] = [];
  const deleteEntries: GitIndexEntry[] = [];

  // 既存のIndexEntryの更新・削除
  gitIndexFile.index.entries.forEach((entry) => {
    const path = TsGitPath.fromRep(gitPath, entry.pathName);
    if (!evalPathInPathspec(pathspecList, path)) return; // pathspec範囲外なら早期return
    if (existsSync(path.abs)) {
      // TODO: もうちょっと吟味。ファイルの更新日とかで判定したい。
      updatePath.push(path);
      deleteEntries.push(entry);
    } else {
      deleteEntries.push(entry);
    }
  });

  // 新規のIndexEntry追加
  const gitignore = loadGitignore(gitPath);
  const filePathList = getAllNotIgnoreFilePath(gitPath, gitignore);
  updatePath.push(...filePathList.filter((path) => !gitIndexFile.index.entries.some((entry) => entry.pathName === path.rep)))

  // 更新対象パスリストのすべてのパスについて、IndexEntryを作成する。
  const entries = await Promise.all(updatePath.map(async (path) => {
    const gitObjectBlob: GitObjectBlob = { type: 'blob', content: readFileSync(path.abs) };
    const hash = await gitObjectDataStore.add(gitObjectBlob);
    return createGitIndexEntry(path, hash, 'regular')
  }));

  // 更新追加
  const newIndex = gitIndexFile.index;
  newIndex.entries = newIndex.entries.filter((entry) => !deleteEntries.includes(entry));
  newIndex.entries.push(...entries);
  gitIndexFile.index = newIndex;

  // 書き込み
  gitIndexFile.write();

};
