import { UnixPermission } from "../../util/UnixPermission";
import { TsGitPath } from "../filePath/TsGitPath";
import { GitHash } from "../gitObject/gitObject";
import { lstatSync } from 'fs';
import { GitIndexEntry, GitIndexEntryStage } from "./gitIndex";

/** 既存のファイルからGitIndexEntryを作成する。 */
export const createGitIndexEntry = (path: TsGitPath, hash: GitHash, stage: GitIndexEntryStage): GitIndexEntry => {
  const lstat = lstatSync(path.abs);
  const { ctimeMs, mtimeMs, dev, ino, uid, gid, mode, size: fileSize } = lstat;
  const { second: ctimeSeconds, nanoSecond: ctimeNanosecondFractions } = convertSecond(ctimeMs);
  const { second: mtimeSeconds, nanoSecond: mtimeNanosecondFractions } = convertSecond(mtimeMs);
  const unixPermission = getUnixPermissionFromMode(mode);

  return {
    ctimeSeconds, ctimeNanosecondFractions, mtimeSeconds, mtimeNanosecondFractions, dev, unixPermission, uid, gid, fileSize, hash, stage,
    ino: ino >= (1 << 32) ? 0 : ino, // Stats.inoだと64bit値が取得されてしまい、これをencodeGitIndex内で4Byte値に変換する際にエラーとなってしまうので、いったん0固定にしちゃう。
    objectType: 'regular-file',
    assumeValidFlag: false,
    extendedFlag: false,
    pathName: path.rep,
  };
};

/**
 * ミリ秒単位の数値を、秒単位 + ナノ秒単位に分解する。
 */
const convertSecond = (ms: number) => {
  const second = Math.floor(ms / 1_000);
  const nanoSecond = Math.floor((ms % 1_000) * 1_000_000);
  return { second, nanoSecond };
};

const getUnixPermissionFromMode = (mode: number): UnixPermission => {
  return {
    owner: { r: Boolean(mode & (1 << 8)), w: Boolean(mode & (1 << 7)), x: Boolean(mode & (1 << 6)), },
    group: { r: Boolean(mode & (1 << 5)), w: Boolean(mode & (1 << 4)), x: Boolean(mode & (1 << 3)), },
    others: { r: Boolean(mode & (1 << 2)), w: Boolean(mode & (1 << 1)), x: Boolean(mode & (1 << 0)), },
  }
};
