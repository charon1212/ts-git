import { resolve } from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';
import * as iconv from 'iconv-lite';

/**
 * シナリオテストで各種コマンドを発行したりファイル操作を行うための疑似的なターミナル。
 */
export class ScenarioTestUtilTerminal {
  private cwd: string;
  constructor() {
    this.cwd = process.cwd();
  };
  private logHistory: string[] = [];
  private log(log: string) {
    this.logHistory.push(log);
  }
  exe(command: string) {
    /** TODO: windows前提で、「sjis -> utf8」変換をかませている。 */
    this.log(`[exe]${command}`);
    return iconv.decode(execSync(command, { cwd: this.cwd }), 'Shift_JIS');
  }
  cd(...paths: string[]) {
    this.cwd = resolve(this.cwd, ...paths);
    this.log(`[cd]${this.cwd}`);
    return this.cwd;
  }
  pwd() {
    return this.cwd;
  }
  ls() {
    return fs.readdirSync(this.cwd);
  }
  /**
   * ディレクトリを作成する。
   * @param paths 複数パスを指定可能。複数指定した場合、それぞれのディレクトリを作るのではなく、resolveでそれらのパスをつなげたパスのディレクトリを作成する。例えば、カレントが`/current`の場合に('hoge','fuga')を指定すると、`/current/hoge/fuga`ディレクトリを作成する。
   */
  mkdir(...paths: string[]) {
    const path = resolve(this.cwd, ...paths);
    this.log(`[mkdir]${path}`);
    fs.mkdirSync(path, { recursive: true });
    return path;
  }
  mkFile(content: string | Buffer, ...paths: string[]) {
    const path = resolve(this.cwd, ...paths);
    this.log(`[mkFile]${path}`);
    fs.writeFileSync(path, content);
    return path;
  }
  rm(...paths: string[]) {
    const path = resolve(this.cwd, ...paths);
    this.log(`[rm_check-exist]${path}`);
    if (fs.existsSync(path)) {
      this.log(`[rm]${path}`);
      fs.rmSync(path, { recursive: true });
    }
    return path;
  }
};
