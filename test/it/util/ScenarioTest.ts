import { writeFileSync } from "fs";
import { ScenarioTestUtilTerminal } from "./ScenarioTestUtilTerminal";
import { analyzeDirectory } from "./analyzeDirectory";
import { resolve } from 'path';

const repositoryRoot = process.cwd();

export class ScenarioTest {

  private gitTerminal: ScenarioTestUtilTerminal;
  private tsgitTerminal: ScenarioTestUtilTerminal;
  private root: string;

  constructor(private scenarioName: string) {
    this.gitTerminal = new ScenarioTestUtilTerminal();
    this.tsgitTerminal = new ScenarioTestUtilTerminal();
    this.root = resolve(repositoryRoot, 'it', 'scenario-test', this.scenarioName);
  };

  startup() {
    const stut = new ScenarioTestUtilTerminal();
    stut.cd(repositoryRoot);
    stut.mkdir('it', 'scenario-test', this.scenarioName);

    this.gitTerminal.cd(this.root);
    this.gitTerminal.mkdir('git');
    this.gitTerminal.cd('git');
    this.tsgitTerminal.cd(this.root);
    this.tsgitTerminal.mkdir('tsgit');
    this.tsgitTerminal.cd('tsgit');
  }

  git(command: string) {
    const git = this.gitTerminal.exe(`git ${command}`);
    const tsgit = this.tsgitTerminal.exe(`ts-git ${command}`);
    return { git, tsgit };
  }

  command(callback: (stut: ScenarioTestUtilTerminal) => string) {
    const git = callback(this.gitTerminal);
    const tsgit = callback(this.tsgitTerminal);
    return { git, tsgit };
  }

  assert<T>(getValue: (stut: ScenarioTestUtilTerminal) => T, assertion: (gitValue: T, tsgitValue: T) => void) {
    assertion(getValue(this.gitTerminal), getValue(this.tsgitTerminal));
  }

  resetCwd() {
    this.gitTerminal.cd(this.root, 'git');
    this.tsgitTerminal.cd(this.root, 'tsgit');
  }

  private analyzeReportCount = 1;
  /** 両ディレクトリの差分を検出し、レポートとして保存する。 */
  analyze() {
    const { text } = analyzeDirectory(resolve(this.root, 'git'), resolve(this.root, 'tsgit'));
    writeFileSync(resolve(this.root, `ScenarioAnalyzeReport-${this.analyzeReportCount}`), text);
    this.analyzeReportCount++;
  }

  static beforeAll() {
    const stut = new ScenarioTestUtilTerminal();
    stut.cd(repositoryRoot);
    stut.rm('it');
    stut.mkdir('it', 'scenario-test');
  }

};
