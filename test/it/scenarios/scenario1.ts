import { ScenarioTest } from "../util/ScenarioTest";

export const scenario1 = async (scenario1: ScenarioTest): Promise<void> => {

  // operation
  scenario1.startup();
  scenario1.git('init');
  scenario1.command((stut) => stut.mkFile('hoge', 'file1.txt'));
  scenario1.git('add .');
  scenario1.command((stut) => stut.mkFile('fuga', 'file1.txt'));
  scenario1.git('add .');

  // analyze
  scenario1.analyze();

  // assertion
  scenario1.assert((stut) => stut.exe('git ls-files --stage'), (git, tsgit) => {
    // 権限だけ差分があるが、NodeJSのfs.lstatSync().modeは666権限を確かに示すので、いったんこの部分を無視する。
    const act = tsgit.split('\n').map((line) => line.slice(7)).join('\n');
    const exp = git.split('\n').map((line) => line.slice(7)).join('\n');
    expect(act).toBe(exp);
  });

};
