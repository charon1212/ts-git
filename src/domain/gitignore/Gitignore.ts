// see <doc/gitignore.md>

export type Gitignore = { sources: GitignoreSource[], };

/**
 * Gitignoreソースとは、いくつかのGitignoreパターンが記述された1つの情報源を示す。
 * それは、1つの.gitignoreファイルや、コマンドラインオプションや、.git/info/excludeファイル等の単位を示す。
 */
export type GitignoreSource = {
  /** このgitignoreセットの読み込み元を示す優先順位。この優先順位の昇順で処理し、あとの処理が前の処理結果を上書きする。 */
  priority: GitignorePriority,
  /**
   * 適用範囲のprefix。
   * .gitignoreファイル以外の場合は空文字。
   * .gitignoreファイルの場合、そのファイルが配置されているディレクトリの、Gitリポジトリルートからの相対パス。トップレベルに配置した.gitignoreファイルの場合は空文字。
   * 例えば、リポジトリルートから見て sub-module/SOME/.gitignore ファイルを読み込んだ場合、prefixは「sub-module/SOME」とする。
   **/
  prefix: string,
  patterns: GitignorePattern[],
};

export type GitignorePriority =
  1 // Patterns read from the command line
  | 2 // Patterns read from a .gitignore file
  | 3 // Patterns read from $GIT_DIR/info/exclude
  | 4; // Patterns read from the file specified by the configuration variable core.excludesFile

export type GitignorePattern = {
  /** trueの場合、先頭が「!」のgitignoreパターンであり、パターンにマッチした対象を無視しないことを意味する。 */
  not: boolean,
  /** trueの場合、末尾が「/」のgitignoreパターンであり、ディレクトリのみを判定対象とする。 */
  isOnlyDirectory: boolean,
  /** trueの場合、開始・中間のいずれかに「/」を含むgitignoreパターンであり、このパターンは.gitignoreファイル等のソースからの相対パスで判定することを意味する。 */
  relative: boolean,
  /** 判定対象のマッチング文字列。末尾の「/」は常に含まないものとする。（//で終わる変なパターンを除き） */
  exp: string,
  /** ソースに記載されていた元の形式のpattern */
  source: string,
};
