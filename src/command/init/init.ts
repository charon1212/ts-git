import { CommandDispatcher } from "../Command";
import { registerCommandOption } from "../CommandArgs";
import * as fs from 'fs';

registerCommandOption('init', []);

export const commandInit: CommandDispatcher = (args, options) => {

  const root = args[0] || '.';
  if (fs.existsSync(`${root}/.git`)) {
    throw new Error(`既にリポジトリが存在します: ${`${root}/.git`}`);
  }
  fs.mkdirSync(`${root}/.git`);
  fs.mkdirSync(`${root}/.git/objects`);
  fs.mkdirSync(`${root}/.git/objects/info`);
  fs.mkdirSync(`${root}/.git/objects/pack`);

};
