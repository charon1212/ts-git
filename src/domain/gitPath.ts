import { join } from 'path';
import { GitHash } from './gitObject/gitObject';

const cwd = process.cwd();

/** 各種パス */
export const getGitPath = (rootDir?: string) => ({
  git: {
    path: join(rootDir ?? cwd, '.git'),
    objects: {
      path: join(rootDir ?? cwd, '.git', 'objects'),
    },
    HEAD: {
      path: join(rootDir ?? cwd, '.git', 'HEAD'),
    },
    index: {
      path: join(rootDir ?? cwd, '.git', 'index'),
    },
  },
  fromHash: (gitHash: GitHash) => join(rootDir ?? cwd, '.git', 'objects', gitHash.slice(0, 2), gitHash.slice(2)),
});

export type GitPath = ReturnType<typeof getGitPath>;
export const gitPath = getGitPath();
