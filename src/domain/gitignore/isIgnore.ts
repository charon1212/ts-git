import { Gitignore, GitignorePattern } from "./Gitignore";
import wcmatch from 'wildcard-match';
import { TsGitPath } from "../filePath/TsGitPath";

/**
 * 対象のファイル/ディレクトリパスが、gitignore上で無視されるか判定する。
 *
 * @param path ファイル/ディレクトリパス。リポジトリルートからの相対パスで表現し、最初と最後に「/」を含まないパスとする。（「src/index.js」等）
 * @param gitignore Gitignore
 * @param isDir このパスがファイルパスの場合はfalse、ディレクトリパスの場合はtrueを指定する。
 * @returns 無視するパターンの場合はtrue、そうでない場合はfalse。
 */
export const isIgnore = (path: TsGitPath, gitignore: Gitignore, isDir: boolean): boolean => {

  /** 検査対象とするgitignoreパターンソースは、prefix未指定か、またはパスがprefixから始まる場合のみ */
  const targetSource = gitignore.sources.filter((source) => source.prefix === '' || path.rep.startsWith(source.prefix));
  /** gitignoreパターンソースを、処理順に並べる。処理順は、基本的に優先順位の順に行い、時点で階層の浅い.gitignoreファイルから順に処理する。（より深い.gitignoreファイルで上書きする） */
  targetSource.sort((source1, source2) => {
    if (source1.priority !== source2.priority) return source1.priority - source2.priority;
    return source1.prefix.length - source2.prefix.length;
  });

  let isIgnore = false;
  for (let source of targetSource) {
    for (let pattern of source.patterns) {
      if (matchPattern(path, pattern, isDir)) {
        // pattern.notがtrueの場合（先頭が「!」で始まる否定パターンの場合）、isIgnore=falseに復活させる。そうでなければisIgnore=trueとする。
        isIgnore = !pattern.not;
      }
    }
  }

  return isIgnore;
};

const matchPattern = (path: TsGitPath, pattern: GitignorePattern, isDir: boolean): boolean => {
  if (pattern.isOnlyDirectory && !isDir) return false;
  return wcmatch(pattern.exp)(pattern.relative ? path.rep : path.basename());
};
