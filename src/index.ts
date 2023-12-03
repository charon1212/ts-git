import { dispatchCommand } from "./command/Command";
import { interpretCommandArgs } from "./command/CommandArgs";

const index = () => {
  const { command, args, options } = interpretCommandArgs(process.argv.slice(2));
  dispatchCommand(command, args, options);
};

index();
