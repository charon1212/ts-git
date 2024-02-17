import { TsGitPath } from "../filePath/TsGitPath";
import { Pathspec } from "./Pathspec";

/**
 * あるpathがpathspecで制限された範囲内であることを評価する。
 * @param pathspecs pathspecのリスト
 * @param path 評価対象のパス
 * @returns 範囲内である場合はtrue、そうでない場合はfalse
 */
export const evalPathInPathspec = (pathspecs: Pathspec[], path: TsGitPath): boolean => {
  if (pathspecs.length === 0) throw new Error('No pathspec found.');

  if (isOnlyEmptyPathspec(pathspecs)) return false;
  // これ以降、pathspecsは全てemptyでないとして処理できる。（上記でemptyを含む場合を処理済みのため）

  const includePathspec = pathspecs.filter((pathspec) => !pathspec.magic.exclude);
  const excludePathspec = pathspecs.filter((pathspec) => pathspec.magic.exclude);
  if (includePathspec.some((pathspec) => matchPathspec(pathspec, path))) {
    if (excludePathspec.some((pathspec) => matchPathspec(pathspec, path))) return false;
    return true;
  } else {
    return false;
  }
};

const matchPathspec = (pathspec: Pathspec, path: TsGitPath): boolean => {
  const testPath = pathspec.magic.top ? path.rep : path.abs;
  if (pathspec.regexFile?.test(testPath)) return true;
  if (pathspec.regexDir?.test(testPath)) return true;
  return false;
};

/**
 * pathspecがempty1つのみからなることを判定する。
 * また、そうでない場合、empty pathspecを含まないことをチェックする。
 *
 * > A pathspec with only a colon means "there is no pathspec". This form should not be combined with other pathspec.
 *
 */
const isOnlyEmptyPathspec = (pathspecs: Pathspec[]): boolean => {
  if (pathspecs.some((pathspec) => pathspec.empty)) {
    if (pathspecs.length !== 1) throw new Error('Empty Pathspecはそれ単一で利用しなければなりません。');
    return true;
  } else {
    return false;
  }
};
