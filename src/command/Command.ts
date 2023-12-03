import { commandInit } from "./init/init";

export type Command = 'init' | 'add';
export type CommandDispatcher = (args: string[], options: { key: string, value?: string }[]) => unknown;
const commandList: { command: Command, dispatcher: CommandDispatcher }[] = [
  { command: 'init', dispatcher: commandInit },
];

export const dispatchCommand = (command: Command, args: string[], options: { key: string, value?: string }[],) => {
  commandList.find((v) => v.command === command)?.dispatcher(args, options);
};

export const isCommand = (args: string): args is Command => commandList.some(({ command }) => command === args);
