import { Pathspec, PathspecMagic } from "./Pathspec";
import { resolve, sep } from 'path';

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
  const onlyDirectory = exp.endsWith('/') || exp.endsWith(sep);
  if (onlyDirectory) exp = exp.slice(0, -1);

  // 判定用の正規表現を取得。
  const flags = magic.icase ? 'i' : '';
  const patternFile = regexEscape(resolve(exp), magic.literal);
  const patternDir = regexEscape(resolve(exp), magic.literal) + sep + '*';
  const regexFile = onlyDirectory ? undefined : new RegExp(patternFile, flags);
  const regexDir = new RegExp(patternDir, flags);

  return { exp, empty: false, regexFile, regexDir, magic };
};

const pathspecRegexEscapeCharacters = ['\\', '^', '$', ',', '.', '+', '(', ')', '[', ']', '{', '}', '|', '/'];
const pathspecRegexEscapeCharactersLiteral = ['*', '?',];
/**
 * pathspec用の正規表現エスケープ。対象は以下の内、特殊記号のエスケープのみ採用。
 * <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Character_escape>
 */
const regexEscape = (str: string, literal: boolean,): string => {
  pathspecRegexEscapeCharacters.forEach((esc) => {
    str = str.replace(new RegExp(`\\${esc}`, 'g'), `\\${esc}`);
  });
  if (literal) {
    pathspecRegexEscapeCharactersLiteral.forEach((esc) => {
      str = str.replace(new RegExp(`\\${esc}`, 'g'), `\\${esc}`);
    });
  }
  return str;
};
