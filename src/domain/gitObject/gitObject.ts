import { GitObjectBlob } from "./gitObjectBlob";
import { GitObjectCommit } from "./gitObjectCommit";
import { GitObjectTree } from "./gitObjectTree";
import { NominalType, createNominalType } from 'util-charon1212';

export type GitObjectType = 'blob' | 'tree' | 'commit';
export const isGitObjectType = (type: unknown): type is GitObjectType => {
  if (type === 'blob') return true;
  if (type === 'tree') return true;
  if (type === 'commit') return true;
  return false;
};

export type GitObject = GitObjectBlob | GitObjectTree | GitObjectCommit;

export type GitHash = NominalType<'git-hash', string>;
export const createGitHash = createNominalType<GitHash>();
