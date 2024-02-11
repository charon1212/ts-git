import { Command } from "commander";
import { commander_init } from "./init/init";
import { commander_explore } from "./explore/explore";
import { commander_add } from "./add/add";
const command = new Command();

export const addCommands = () => {
  commander_init(command);
  commander_add(command);
  commander_explore(command);
};

export const execCommand = () => {
  command.parse();
};
