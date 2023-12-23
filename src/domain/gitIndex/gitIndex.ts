import { UnixPermission } from "../../util/UnixPermission";
import { GitHash } from "../gitObject/gitObject";

export type GitIndex = {
  entries: GitIndexEntry[],
};

export type GitIndexEntry = {
  /** ファイルステータスが最後に変更された時刻 */
  ctimeSeconds: number,
  /** ファイルステータスが最後に変更された時刻(ナノ秒) */
  ctimeNanosecondFractions: number,
  /** ファイルのデータが最後に修正された時刻 */
  mtimeSeconds: number,
  /** ファイルのデータが最後に修正された時刻(ナノ秒) */
  mtimeNanosecondFractions: number,
  /** ファイルを含むデバイスの数値 ID */
  dev: number,
  /** ファイルの i ノード番号 */
  ino: number,
  /** オブジェクトタイプ */
  objectType: GitIndexEntryObjectType,
  /** ファイル権限 */
  unixPermission: UnixPermission,
  /** ファイルの所有者のユーザID */
  uid: number,
  /** ファイルのグループID */
  gid: number,
  /** ディスク上のサイズ(32bit以上の場合は切り捨て) */
  fileSize: number,
  /** このファイルのBlobオブジェクトのハッシュ値 */
  hash: GitHash,
  /** `git update-index --assume-unchanged`コマンドなどを実行した際の情報を保持するフラグ列 */
  assumeValidFlag: boolean,
  /** 拡張情報を持つかのフラグ。index-formatのバージョン2ではfalse固定。 */
  extendedFlag: false,
  /** stage状態フラグ */
  stage: GitIndexEntryStage,
  /** パス名 */
  pathName: string,
};

/**
 * GitIndexエントリのStage状態。コンフリクトしていない場合は'regular'、コンフリクトしている場合は、'base','ours','theirs'。
 *
 * - 'ours': 現在チェックアウトしている側の変更
 * - 'theirs': マージ対象の変更
 * - 'base': oursとtheirsの競合前の状態
 *
 */
export type GitIndexEntryStage = 'regular' | 'base' | 'ours' | 'theirs';
export const encodeGitIndexEntryStage = (stage: GitIndexEntryStage): number => {
  if (stage === 'regular') return 0b00;
  if (stage === 'base') return 0b10;
  if (stage === 'ours') return 0b01;
  if (stage === 'theirs') return 0b11;
  throw new Error(`cannot encode stage: stage=[${stage}]`);
};
export const decodeGitIndexEntryStage = (num: number): GitIndexEntryStage => {
  if (num === 0b00) return 'regular';
  if (num === 0b10) return 'base';
  if (num === 0b01) return 'ours';
  if (num === 0b11) return 'theirs';
  throw new Error(`cannot decode stage: num=[${num}]`);
};

/**
 * GitIndexエントリのタイプ。
 *
 * - 'regular-file': 通常ファイル
 * - 'symbolic-link': シンボリックリンク
 * - 'gitlink': gitリンク
 *
 */
export type GitIndexEntryObjectType = 'regular-file' | 'symbolic-link' | 'gitlink';
export const encodeGitIndexEntryObjectType = (objectType: GitIndexEntryObjectType): number => {
  if (objectType === 'regular-file') return 0b1000;
  if (objectType === 'symbolic-link') return 0b1010;
  if (objectType === 'gitlink') return 0b1110;
  throw new Error(`cannot encode object type: objectType=[${objectType}]`);
};
export const decodeGitIndexEntryObjectType = (num: number): GitIndexEntryObjectType => {
  if (num === 0b1000) return 'regular-file';
  if (num === 0b1010) return 'symbolic-link';
  if (num === 0b1110) return 'gitlink';
  throw new Error(`cannot decode object type: num=[${num}]`);
};
