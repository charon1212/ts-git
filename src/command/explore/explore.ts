import * as fs from 'fs';
import { Command } from "commander";
import { decodeGitIndex } from '../../domain/gitIndex/decodeGitIndex';
import { getGitPathFromHash } from '../../domain/gitPath';
import { GitHash } from '../../domain/gitObject/gitObject';
import { join } from 'path';

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
    .action((args: ExploreOptions) => {
      explore(args);
    });
};

type ExploreOptions = { directory: string, hash: string, showIndex: boolean };
const explore = (args: ExploreOptions) => {
  console.log(`explore: ${JSON.stringify({ args })}`);
  const { directory, hash, showIndex } = args;
  const dotGitDir = `${directory}/.git`
  if (!fs.existsSync(dotGitDir)) throw new Error('dot git dir not exists.');

  if (showIndex) {
    const indexFilePath = `${dotGitDir}/index`;
    const bufIndexFile = fs.readFileSync(indexFilePath);
    const decodedIndex = decodeGitIndex(bufIndexFile);
    console.log(JSON.stringify({ decodedIndex }));
    return;
  }

  if (hash) {
    const path = join(dotGitDir, 'objects', hash.slice(0, 2), hash.slice(2));
    
  }


};
