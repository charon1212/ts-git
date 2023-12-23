import { UnixPermission, encodeUnixPermissionToDecimal } from "../../util/UnixPermission";
import { createSha1 } from "../../util/sha1";
import { GitIndex, GitIndexEntry, GitIndexEntryObjectType, GitIndexEntryStage, encodeGitIndexEntryObjectType, encodeGitIndexEntryStage } from "./gitIndex";

const gitIndexSignature = 'DIRC';
const gitIndexVersion = 2;

export const encodeGitIndex = (gitIndex: GitIndex): Buffer => {
  // header
  const bufHeader = Buffer.concat([
    Buffer.from(gitIndexSignature),
    get32bitBufferFromNum(gitIndexVersion),
    get32bitBufferFromNum(gitIndex.entries.length),
  ]);

  // header + entries
  const bufBeforeHash = Buffer.concat([
    bufHeader,
    ...gitIndex.entries.map((entry) => encodeGitIndexEntry(entry)),
  ]);

  // hash
  const hash = createSha1(bufBeforeHash);

  // return
  return Buffer.concat([bufBeforeHash, Buffer.from(hash, 'hex')]);
};

/** 各エントリごとのBuffer Encode */
const encodeGitIndexEntry = (entry: GitIndexEntry): Buffer => {
  const { ctimeSeconds, ctimeNanosecondFractions, mtimeSeconds, mtimeNanosecondFractions, dev, ino, objectType, unixPermission, uid, gid, fileSize, hash, assumeValidFlag, extendedFlag, stage, pathName, } = entry;

  const bufPathName = Buffer.from(pathName);
  const bufEntry = Buffer.concat([
    get32bitBufferFromNum(ctimeSeconds),
    get32bitBufferFromNum(ctimeNanosecondFractions),
    get32bitBufferFromNum(mtimeSeconds),
    get32bitBufferFromNum(mtimeNanosecondFractions),
    get32bitBufferFromNum(dev),
    get32bitBufferFromNum(ino),
    encodeGitIndexEntryModeBuffer(objectType, unixPermission),
    get32bitBufferFromNum(uid),
    get32bitBufferFromNum(gid),
    get32bitBufferFromNum(fileSize),
    Buffer.from(hash, 'hex'),
    encodeGitIndexEntryFlagBuffer(assumeValidFlag, extendedFlag, stage, bufPathName.length),
    bufPathName,
  ]);

  return padBufferTo8Bytes(bufEntry);
};

/**
 * GitIndexEntryのMode列を示すバイナリを生成する。
 * mode列を示すバイナリは32bit(4Byte)長で、高bitから順に以下のとおり。
 *
 * - 1~16bit: 未使用(0固定)
 * - 17~20bit: オブジェクトタイプ。有効な値は、1000(通常のファイル)、1010(シンボリックリンク)、1110(gitリンク)。
 * - 21~23bit: 未使用(0固定)
 * - 24~32bit: Unix権限。
 *
 */
const encodeGitIndexEntryModeBuffer = (objectType: GitIndexEntryObjectType, unixPermission: UnixPermission) => {
  const num = (encodeGitIndexEntryObjectType(objectType) << 12) + encodeUnixPermissionToDecimal(unixPermission);
  return get32bitBufferFromNum(num);
};

const maxPathNameLength = (1 << 12) - 1;
/**
 * GitIndexEntryのFlag列を示すバイナリを生成する。
 * Flag列を示すバイナリは16bit(2Byte)長で、高bitから順に以下のとおり。
 *
 * - 1bit: assume-validフラグ。
 * - 2bit: extendedフラグ。
 * - 3~4bit: Stage状態を表すフラグ。00: regular, 01: base, 10: ours, 11: theirs。
 * - 5~16bit: pathName列の長さを示す。ただし、12bit(4096)を超える場合は、4095とする。
 *
 * see: <https://github.com/git/git/blob/v2.43.0/Documentation/gitformat-index.txt#L108>
 *
 */
const encodeGitIndexEntryFlagBuffer = (assumeValidFlag: boolean, extendedFlag: boolean, stage: GitIndexEntryStage, pathNameLength: number) => {
  const number =
    (assumeValidFlag ? 1 << 15 : 0)
    + (extendedFlag ? 1 << 14 : 0)
    + (encodeGitIndexEntryStage(stage) << 12)
    + (pathNameLength > maxPathNameLength ? maxPathNameLength : pathNameLength);
  const buf = Buffer.alloc(2);
  buf.writeUint16BE(number);
  return buf;
};

/** 32bitの数値を示す4ByteのBufferを生成する。（Big Endian） */
const get32bitBufferFromNum = (num: number) => {
  const buf = Buffer.alloc(4);
  buf.writeUint32BE(num);
  return buf;
};

/** 指定したBuffer列が8バイトの整数倍となるように、0でpaddingする。必ず1つ以上の"0x00"を付与する。 */
const padBufferTo8Bytes = (buf: Buffer): Buffer => Buffer.concat([buf, Buffer.alloc(8 - buf.length % 8)]);
