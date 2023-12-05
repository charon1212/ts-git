import * as fs from 'fs';
import { Command } from "commander";

export const commander_init = (command: Command) => {
  command
    .command('init')
    .argument('[root]', 'root directory', '.')
    .action((root: string) => {
      init(root);
    });
};

const init = (root: string) => {
  if (fs.existsSync(`${root}/.git`)) {
    throw new Error(`既にリポジトリが存在します: ${`${root}/.git`}`);
  }
  fs.mkdirSync(`${root}/.git`);
  fs.mkdirSync(`${root}/.git/objects`);
  fs.mkdirSync(`${root}/.git/objects/info`);
  fs.mkdirSync(`${root}/.git/objects/pack`);
};
