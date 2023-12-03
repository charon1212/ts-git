import { CommandDispatcher } from "../Command";
import { registerCommandOption } from "../CommandArgs";
import * as fs from 'fs';

registerCommandOption('init', []);

export const commandInit: CommandDispatcher = (args, options) => {

  const root = args[0] || '.';
  console.log(`${JSON.stringify(root)}`);
  // fs.mkdirSync(`${root}/.git`);
  // fs.mkdirSync(`${root}/.git/objects`);
  // fs.mkdirSync(`${root}/.git/objects/info`);
  // fs.mkdirSync(`${root}/.git/objects/pack`);

  fs.mkdirSync(`commandtest/.git`);

};
