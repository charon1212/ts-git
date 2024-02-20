import { myPath } from "../../util/MyPath";
import { Pathspec, PathspecMagic } from "./Pathspec";

/**
 * pathspecの文字列表現から、pathspecオブジェクトを作成する。
 * @param exp pathspecの文字列表現
 */
export const parsePathspec = (exp: string): Pathspec => {
  // デフォルトのpathspec magic
  const magic: PathspecMagic = { top: false, literal: false, icase: false, glob: false, attr: false, exclude: false, };

  // Empty Pathspec（「:」1文字からなるpathspec）の判定。
  if (exp === ':') return { exp, empty: true, magic, regexDir: undefined, regexFile: undefined };

  // 先頭のmagicを処理
  if (exp.startsWith(':')) {
    if (exp.startsWith(':(')) { // long-form
    } else { // short-form
    }
    throw new Error('magic pathspec は未実装。'); // TODO: IMPLEMENTATION OF MAGIC PATHSPEC
  }

  // 末尾に「/」があるpathspecはディレクトリのみ判定する
  const onlyDirectory = exp.endsWith('/') || exp.endsWith(myPath.sep);
  if (onlyDirectory) exp = exp.slice(0, -1);

  // 判定用の正規表現を取得。
  const resolvePath = myPath.resolve(exp);
  const flags = magic.icase ? 'i' : '';
  const patternFile = getRegexPattern(resolvePath, getMap(magic.literal));
  const patternDir = patternFile + `\\${myPath.sep}.*`;
  const regexFile = onlyDirectory ? undefined : new RegExp(`^${patternFile}$`, flags);
  const regexDir = new RegExp(`^${patternDir}$`, flags);

  return { exp, empty: false, regexFile, regexDir, magic };
};

/**
 * 正規表現のエスケープ対象特殊記号の一覧。
 * <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Character_escape>
 */
const mapRegexEscape: { [key in string]: string } = {
  '\\': '\\\\',
  '^': '\\^',
  '$': '\\$',
  ',': '\\,',
  '.': '\\.',
  '+': '\\+',
  '(': '\\(',
  ')': '\\)',
  '[': '\\[',
  ']': '\\]',
  '{': '\\{',
  '}': '\\}',
  '|': '\\|',
  '/': '\\/',
};
/**
 * getRegexPatternで利用する変換表を作成する。
 * @param isMagicLiteral literal magicを利用したpathspecであればtrue、そうでなければfalse。
 */
const getMap = (isMagicLiteral: boolean) => ({
  ...mapRegexEscape,
  '*': isMagicLiteral ? '\\*' : '.*',
  '?': isMagicLiteral ? '\\?' : '.',
});
/**
 * pathspecを表す文字列から、判定を行う正規表現パターンを取得する。
 * @param source pathspec文字列。
 * @param map 変換表を示すmapオブジェクト。このオブジェクトのKeyは、1文字で構成すること。
 * @returns 正規表現のパターン
 */
const getRegexPattern = (source: string, map: { [key in string]: string }) => {
  let result = '';
  for (let i = 0; i < source.length; i++) result += map[source[i]] ?? source[i];
  return result;
};
