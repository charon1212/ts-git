import * as fs from 'fs';
import { Command } from "commander";
import { GitPath } from '../../domain/gitPath';

export const commander_init = (command: Command) => {
  command
    .command('init')
    .argument('[root]', 'root directory', '.')
    .action((root: string) => {
      init(root);
    });
};

const init = (root: string) => {
  const gitPath = new GitPath(root);
  if (fs.existsSync(gitPath.git.path.abs)) {
    throw new Error(`既にリポジトリが存在します: ${gitPath.git.path.abs}`);
  }
  fs.mkdirSync(gitPath.git.path.abs);
  fs.mkdirSync(gitPath.git.objects.path.abs);
  fs.mkdirSync(gitPath.git.objects.info.path.abs);
  fs.mkdirSync(gitPath.git.objects.pack.path.abs);
  fs.mkdirSync(gitPath.git.refs.path.abs);
  fs.mkdirSync(gitPath.git.refs.heads.path.abs);
  fs.mkdirSync(gitPath.git.refs.tags.path.abs);
  fs.writeFileSync(gitPath.git.HEAD.path.abs, 'ref: refs/heads/master\n');
  fs.writeFileSync(gitPath.git.config.path.abs, '');
  fs.writeFileSync(gitPath.git.description.path.abs, "Unnamed repository; edit this file 'description' to name the repository.\n");
};
