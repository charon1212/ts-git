export type Command = 'init' | 'add';
export type CommandDispatcher = (args: string[], options: { key: string, value?: string }[]) => unknown;
const CommandList: Command[] = ['init', 'add'];

export const dispatchCommand = (command: Command, args: string[], options: { key: string, value?: string }[],) => {
  switch (command) {
    case 'init':
      break;
    case 'add':
      break;
    default:
      command satisfies never; // switch-case書き漏れのためのおまじない
  }
};

export const isCommand = (args: string): args is Command => CommandList.some((c) => c === args);
