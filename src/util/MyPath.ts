import { sep, resolve, join, basename, dirname, } from 'path';

/** テスト用に、pathモジュールをラップ。 */
export class MyPath {
  constructor() { }
  /** The platform-specific file separator. '\' or '/'. */
  get sep() {
    return sep;
  }
  /**
   * The right-most parameter is considered {to}. Other parameters are considered an array of {from}.
   *
   * Starting from leftmost {from} parameter, resolves {to} to an absolute path.
   *
   * If {to} isn't already absolute, {from} arguments are prepended in right to left order,
   * until an absolute path is found. If after using all {from} paths still no absolute path is found,
   * the current working directory is used as well. The resulting path is normalized,
   * and trailing slashes are removed unless the path gets resolved to the root directory.
   *
   * @param paths A sequence of paths or path segments.
   * @throws {TypeError} if any of the arguments is not a string.
   */
  resolve(...args: Parameters<typeof resolve>): ReturnType<typeof resolve> {
    return resolve(...args);
  }
  /**
   * Join all arguments together and normalize the resulting path.
   *
   * @param paths paths to join.
   * @throws {TypeError} if any of the path segments is not a string.
   */
  join(...args: Parameters<typeof join>): ReturnType<typeof join> {
    return join(...args);
  }
  /**
   * Return the last portion of a path. Similar to the Unix basename command.
   * Often used to extract the file name from a fully qualified path.
   *
   * @param path the path to evaluate.
   * @param suffix optionally, an extension to remove from the result.
   * @throws {TypeError} if `path` is not a string or if `ext` is given and is not a string.
   */
  basename(...args: Parameters<typeof basename>): ReturnType<typeof basename> {
    return basename(...args);
  }
  /**
   * Return the directory name of a path. Similar to the Unix dirname command.
   *
   * @param path the path to evaluate.
   * @throws {TypeError} if `path` is not a string.
   */
  dirname(...args: Parameters<typeof dirname>): ReturnType<typeof dirname> {
    return dirname(...args);
  }
};

export const myPath = new MyPath();
