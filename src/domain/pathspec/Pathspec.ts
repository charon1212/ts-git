/**
 * pathspec <https://git-scm.com/docs/gitglossary/en#Documentation/gitglossary.txt-aiddefpathspecapathspec>
 */
export type Pathspec = {
  /** cli等で入力された値そのものを格納しておくフィールド */
  exp: string,
  /** trueの場合、コロン1文字「:」からなる特殊なempty pathspecであることを示す。 */
  empty: boolean,
  /** pathspecに付加情報を付与するmagic。 */
  magic: PathspecMagic,
  /** このpathspecがファイルにマッチするファイルパスを判定するための正規表現。 */
  regexFile: RegExp | undefined,
  /**
   * このpathspecがディレクトリにマッチするファイルパスを判定するための正規表現。
   * `<pathspec>/*`形式の正規表現を示す。例えば、pathspecが`dir1/dir2`なら、この正規表現は`dir1/dir2/*`を示す。
   */
  regexDir: RegExp | undefined,
};

export type PathspecMagic = {
  /** リポジトリルートからのパスで検索する。<https://git-scm.com/docs/gitglossary/en#Documentation/gitglossary.txt-top> */
  top: boolean,
  /** pathspec内のワイルドカード(?,*)をそのままの文字として扱う。<https://git-scm.com/docs/gitglossary/en#Documentation/gitglossary.txt-literal> */
  literal: boolean,
  /** 大文字・小文字を区別しない。<https://git-scm.com/docs/gitglossary/en#Documentation/gitglossary.txt-icase> */
  icase: boolean,
  /** 指定したpathspecをglob表現として解釈する。<https://git-scm.com/docs/gitglossary/en#Documentation/gitglossary.txt-glob> */
  glob: boolean,
  /** pathspecの制限に加えてさらに、Git属性の判定も追加で行う。<https://git-scm.com/docs/gitglossary/en#Documentation/gitglossary.txt-attr> */
  // TODO: booleanでは管理できない。のちに正しく型定義を行う。
  attr: boolean,
  /** 除外pathspecを定義する。<https://git-scm.com/docs/gitglossary/en#Documentation/gitglossary.txt-exclude> */
  exclude: boolean,
};
