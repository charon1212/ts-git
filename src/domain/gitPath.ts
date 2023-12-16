import { join } from 'path';
import { GitHash } from './gitObject/gitObject';

const cwd = process.cwd();
const DOT_GIT = '.git';

/** 各種パス */
export const gitPath = {
  git: {
    path: join(cwd, DOT_GIT),
    objects: {
      path: join(cwd, DOT_GIT, 'objects'),
    },
    HEAD: {
      path: join(cwd, 'HEAD'),
    },
    index: {
      path: join(cwd, 'index'),
    },
  },
};

/** Gitオブジェクトのパス */
export const getGitPathFromHash = (gitHash: GitHash) => join(gitPath.git.objects.path, gitHash.slice(0, 2), gitHash.slice(2));
