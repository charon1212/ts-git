import { join } from 'path';
import { GitHash } from './gitObject/gitObject';

const cwd = process.cwd();
const DOT_GIT = '.git';

/** Gitオブジェクトのパス */
export const getGitPathFromHash = (gitHash: GitHash) => join(gitPath.git.objects.path, gitHash.slice(0, 2), gitHash.slice(2));

/** 各種パス */
export const getGitPath = (rootDir?: string) => ({
  git: {
    path: join(rootDir ?? cwd, '.git'),
    objects: {
      path: join(rootDir ?? cwd, '.git', 'objects'),
    },
    HEAD: {
      path: join(rootDir ?? cwd, 'HEAD'),
    },
    index: {
      path: join(rootDir ?? cwd, 'index'),
    },
  },
});

export type GitPath = ReturnType<typeof getGitPath>;
export const gitPath = getGitPath();
