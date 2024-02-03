import * as fs from 'fs';
import { Command } from "commander";
import { decodeGitIndex } from '../../domain/gitIndex/decodeGitIndex';
import { GitObjectDataStore } from '../../domain/gitObject/GitObjectDataStore';
import { GitPath } from '../../domain/gitPath';
import { createGitHash } from '../../domain/gitObject/gitObject';

/**
 * 勉強用の、独自コマンド。
 * 既存の.gitディレクトリを調査する。
 */
export const commander_explore = (command: Command) => {
  command
    .command('explore')
    .requiredOption('-d, --directory <directory>')
    .option('--hash <hash>')
    .option('--show-index')
    .action(async (args: ExploreOptions) => {
      await explore(args);
    });
};

type ExploreOptions = { directory: string, hash?: string, showIndex?: boolean };
const explore = async (args: ExploreOptions) => {
  console.log(`explore: ${JSON.stringify({ args })}`);
  const { directory, hash, showIndex } = args;

  const gitPath = new GitPath(directory);
  const gitObjectDataStore = new GitObjectDataStore(gitPath);
  if (!fs.existsSync(gitPath.git.path)) throw new Error('dot git dir not exists.');

  if (showIndex) {
    const bufIndexFile = fs.readFileSync(gitPath.git.index.path);
    const decodedIndex = decodeGitIndex(bufIndexFile);
    console.log(JSON.stringify({ decodedIndex }));
    return;
  }

  if (hash) {
    const gitHash = createGitHash(hash);
    console.log({ path: gitPath.fromHash(gitHash) });
    const gitObject = await gitObjectDataStore.read(gitHash);
    if (gitObject.type === 'blob') {
      console.log(JSON.stringify({ gitObject, buffer: gitObject.content.toString() }));
    } else {
      console.log(JSON.stringify({ gitObject }));
    }
  }

};
