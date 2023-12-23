import { Command } from "commander";

export const commander_add = (command: Command) => {
  command
    .command('add')
    .argument('[root]', 'root directory', '.')
    .action(() => {
      add();
    });
};

const add = () => {
};
