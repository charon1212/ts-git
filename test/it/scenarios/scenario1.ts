import { ScenarioTest } from "../util/ScenarioTest";

export const scenario1 = async (scenario1: ScenarioTest): Promise<void> => {

  scenario1.startup();
  scenario1.git('init');
  scenario1.command((stut) => stut.mkFile('hoge', 'file1.txt'));
  scenario1.git('add .');
  scenario1.command((stut) => stut.mkFile('fuga', 'file1.txt'));
  scenario1.git('add .');

  scenario1.analyze();

};
