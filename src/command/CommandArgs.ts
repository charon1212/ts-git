import { Command, isCommand } from "./Command";

export type CommandOption = {
  option: Command,
  hasArg?: boolean,
};

const commandOptionRegistry: { command: Command, options: CommandOption[] }[] = [];

/**
 * コマンドのオプション登録を行う。
 * @param command 
 * @param options 
 * @returns 
 */
export const registerCommandOption = (command: Command, options: CommandOption[]) => {
  options.forEach(({ option }) => {
    if (!option.startsWith('-')) throw new Error(`無効なオプションの登録: ${option}。オプションは必ず"-"から始まります。コマンド: ${command}`);
    if (!option.startsWith('-')) throw new Error(`無効なオプションの登録: ${option}。オプションに=は含めないでください。コマンド: ${command}`);
  });
  commandOptionRegistry.push({ command, options });
};

/**
 * コマンドライン引数を解析して、コマンド・引数・オプションを取得する。
 * @example
 * ```ts
 * interpretCommandArgs(process.argv.slice(2));
 * ```
 */
export const interpretCommandArgs = (commandArgs: string[]): { command: Command, args: string[], options: { key: string, value?: string }[], } => {
  const arg1 = commandArgs[0];
  if (!arg1) {
    throw new Error('コマンドを指定してください。')
  }
  if (!isCommand(arg1)) {
    throw new Error(`未登録のコマンド:${arg1}`);
  }

  const command: Command = arg1;
  const commandOptions = commandOptionRegistry.find((v) => v.command === command) ?? { command, options: [] };
  const options: { key: string, value?: string }[] = [];
  const args: string[] = [];
  let i = 1;
  const addOption = (key: string, value?: string) => {
    const commandOption = commandOptions.options.find((v) => v.option === key);
    if (!commandOption) throw new Error(`未登録のオプションが指定されました: ${key}`);
    if (commandOption.hasArg && !value) throw new Error(`このオプションにはオプション引数が必要です: ${key}`);
    if (!commandOption.hasArg && value) throw new Error(`このオプションにはオプション引数を指定できません: ${key}`);
    options.push({ key, value });
  };

  while (i < commandArgs.length) {
    const item = commandArgs[i];
    if (item.startsWith('-')) { // オプション解析
      if (item.includes('=')) {
        const key = item.substring(0, item.indexOf('='));
        const value = item.substring(item.indexOf('=') + 1);
        addOption(key, value);
      } else {

      }
    } else { // その他
      args.push(item);
    }
  }

  return { command, args, options } as any;
};
