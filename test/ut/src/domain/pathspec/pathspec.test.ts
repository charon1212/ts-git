import { TsGitPath } from '../../../../../src/domain/filePath/TsGitPath';
import { GitPath } from '../../../../../src/domain/gitPath';
import { evalPathInPathspec } from '../../../../../src/domain/pathspec/evalPathspec';
import { parsePathspec } from '../../../../../src/domain/pathspec/parsePathspec';
import { myPath } from '../../../../../src/util/MyPath';
import * as path from 'path';

type TestPattern1 = {
  cwd: string,
  repoRoot: string,
  separator: '\\' | '/',
  pathspecStrList: string[],
  testPathList: { repPath: string, expectInPathspecs: boolean, }[],
};
const patterns1: TestPattern1[] = [
  { /** example: <https://github.com/git/git/blob/v2.43.0/Documentation/glossary-content.txt#L365> */
    cwd: 'C:\\test\\rep\\cwd', repoRoot: 'C:\\test\\rep', separator: '\\',
    pathspecStrList: ['Documentation/*.jpg'],
    testPathList: [
      { expectInPathspecs: true, repPath: 'cwd/Documentation/chapter_1/figure_1.jpg' },
    ],
  },
  { /** カレントディレクトリ(.)pathspec */
    cwd: 'C:\\test\\rep\\cwd', repoRoot: 'C:\\test\\rep', separator: '\\',
    pathspecStrList: ['.'],
    testPathList: [
      { expectInPathspecs: true, repPath: 'cwd/file1.txt' },
      { expectInPathspecs: true, repPath: 'cwd/dir1/file2.txt' },
      { expectInPathspecs: false, repPath: 'file3.txt' },
      { expectInPathspecs: false, repPath: 'dir2/file4.txt' },
    ],
  },
  { /** file pathspec */
    cwd: 'C:\\test\\rep\\cwd', repoRoot: 'C:\\test\\rep', separator: '\\',
    pathspecStrList: ['file1.txt'],
    testPathList: [
      { expectInPathspecs: true, repPath: 'cwd/file1.txt' },
      { expectInPathspecs: false, repPath: 'cwd/file2.txt' },
      { expectInPathspecs: false, repPath: 'cwd/subdir/file1.txt' },
      { expectInPathspecs: false, repPath: 'file1.txt' },
      { expectInPathspecs: false, repPath: 'other/file1.txt' },
    ],
  },
  { /** dir pathspec */
    cwd: 'C:\\test\\rep\\cwd', repoRoot: 'C:\\test\\rep', separator: '\\',
    pathspecStrList: ['dir1/'],
    testPathList: [
      { expectInPathspecs: true, repPath: 'cwd/dir1/file1.txt' },
      { expectInPathspecs: true, repPath: 'cwd/dir1/dir2/file1.txt' },
      { expectInPathspecs: true, repPath: 'cwd/dir1/dir2/dir3/file1.txt' },
      { expectInPathspecs: false, repPath: 'cwd/dir1' },
      { expectInPathspecs: false, repPath: 'cwd/file1.txt' },
      { expectInPathspecs: false, repPath: 'cwd/dir2/file1.txt' },
      { expectInPathspecs: false, repPath: 'cwd/dir2/dir1/file1.txt' },
    ],
  },
];

describe('pathspec', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.each(patterns1)('test-1', (ptn) => {
    const { cwd, repoRoot, separator, pathspecStrList, testPathList } = ptn;

    // mock NodeJS.path
    spyNodeJsPath({ sep: separator, cwd });

    // convert str => pathspec
    const pathspecList = pathspecStrList.map((str) => parsePathspec(str));

    // create git path
    const gitPath = new GitPath(repoRoot);

    // tests
    testPathList.forEach(({ repPath, expectInPathspecs }) => {
      // get actual result
      const act = evalPathInPathspec(pathspecList, TsGitPath.fromRep(gitPath, repPath));
      // assert that act match exp
      expect(act).toBe(expectInPathspecs);
    });
  });
});

const spyNodeJsPath = ({ sep, cwd }: { sep: '\\' | '/', cwd: string }) => {
  // sep
  Object.defineProperty(myPath, 'sep', { get: () => sep, configurable: true });
  // resolve
  const actualCwd = process.cwd();
  const actualSeparator = path.sep;
  jest.spyOn(myPath, 'resolve').mockImplementation((...args: string[]) => {
    return path.resolve(...args).replace(actualCwd, cwd).replace(new RegExp(`\\${actualSeparator}`, 'g'), sep);
  });
};
