import { BufferStream } from "../../util/BufferStream";
import { getUnixPermissionFromDecimal } from "../../util/UnixPermission";
import { getBits } from "../../util/bit";
import { createGitHash } from "../gitObject/gitObject";
import { GitIndex, GitIndexEntry, decodeGitIndexEntryObjectType, decodeGitIndexEntryStage } from "./gitIndex";

const textDecoder = new TextDecoder();

export const decodeGitIndex = (buffer: Buffer) => {

  const stream = new BufferStream(buffer);

  // header
  const signature = textDecoder.decode(stream.next(4));
  const version = stream.next(4).readUInt32BE();
  const entryLength = stream.next(4).readUInt32BE();

  // entries
  const entries: GitIndexEntry[] = [];
  for (let i = 0; i < entryLength; i++) {
    const ctimeSeconds = stream.next(4).readUInt32BE();
    const ctimeNanosecondFractions = stream.next(4).readUInt32BE();
    const mtimeSeconds = stream.next(4).readUInt32BE();
    const mtimeNanosecondFractions = stream.next(4).readUInt32BE();
    const dev = stream.next(4).readUInt32BE();
    const ino = stream.next(4).readUInt32BE();
    const bufMode = stream.next(4);
    const { objectType, unixPermission } = decodeGitIndexEntryMode(bufMode);
    const uid = stream.next(4).readUInt32BE();
    const gid = stream.next(4).readUInt32BE();
    const fileSize = stream.next(4).readUInt32BE();
    const hash = createGitHash(stream.next(20).toString('hex'));
    const bufFlag = stream.next(2);
    const { assumeValidFlag, extendedFlag, stage } = decodeGitIndexEntryFlag(bufFlag);
    // ここまでで62Byte。したがって、pathname列は末尾の"\0x00"を含めて「8n+2」のバイト数。
    // <"s"><"o"><"m"><"e"><"-"><"p"><"a"><"t"><"h"><"-"><"n"><"a"><"m"><"e"><nul><nul><nul><nul><"?"><"?"><"?">
    // \current cursor                                                       \indexNull          \next-entry
    // 0    1    2    3    4    5    6    7    8    9    10   11   12   13   14   15   16   17   18   19   20
    const indexNull = stream.indexOf(0);
    const paddingLength = 8 - ((indexNull + 8 - 2) % 8);
    const pathName = textDecoder.decode(stream.next(indexNull));
    stream.next(paddingLength); // padding分を削除する。

    entries.push({
      ctimeSeconds, ctimeNanosecondFractions, mtimeSeconds, mtimeNanosecondFractions, dev, ino, objectType, unixPermission, uid, gid, fileSize, hash, assumeValidFlag, stage, pathName,
      extendedFlag: extendedFlag as false,
    });
  }

  // extensions TODO: 拡張機能は無いものと想定。
  // hash
  const hash = stream.next(20).toString('hex');

  // Git-index
  const gitIndex: GitIndex = { entries };

  return { header: { signature, version }, gitIndex, hash };

};

const decodeGitIndexEntryMode = (buf: Buffer) => {
  const num = buf.readUInt32BE();
  const bitsObjectType = getBits(num, 12, 16);
  const objectType = decodeGitIndexEntryObjectType(bitsObjectType);
  const bitsUnixPermission = getBits(num, 0, 9);
  const unixPermission = getUnixPermissionFromDecimal(bitsUnixPermission);
  return { objectType, unixPermission };
};

const decodeGitIndexEntryFlag = (buf: Buffer) => {
  const num = buf.readUInt16BE();
  const assumeValidFlag = Boolean(getBits(num, 15, 16));
  const extendedFlag = Boolean(getBits(num, 14, 15));
  const bitsStage = getBits(num, 12, 14);
  const stage = decodeGitIndexEntryStage(bitsStage);
  const pathNameLength = getBits(num, 0, 12);
  return { assumeValidFlag, extendedFlag, stage, pathNameLength };
};
