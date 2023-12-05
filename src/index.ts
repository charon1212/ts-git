import { addCommands, execCommand } from "./command/Commander";

const index = () => {
  addCommands();
  execCommand();
};

index();
