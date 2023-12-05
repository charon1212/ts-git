import { Command } from "commander";
import { commander_init } from "./init/init";
const command = new Command();

export const addCommands = () => {
  commander_init(command);
};

export const execCommand = () => {
  command.parse();
};
