import { Command } from "commander";
import { commander_init } from "./init/init";
import { commander_explore } from "./explore/explore";
const command = new Command();

export const addCommands = () => {
  commander_init(command);
  commander_explore(command);
};

export const execCommand = () => {
  command.parse();
};
