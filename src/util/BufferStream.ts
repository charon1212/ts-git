/** お手製のstream。メモリに全展開なので、あくまで読みやすさのみ… */
export class BufferStream {
  /** 現在のカーソル位置 */
  private cur = 0;
  constructor(public readonly buf: Buffer) { }
  /** 現在のカーソル位置以降で、対象のvalueが出現するindexを探す。戻り値は、現在のカーソル位置から数えて何バイト目かで返却する。 */
  indexOf(value: string | number | Uint8Array) {
    const index = this.buf.indexOf(value, this.cur);
    if (index === -1) return index;
    else return index - this.cur;
  }
  /** 現在のカーソル位置からbytesバイトを読み込み返却し、カーソル位置をbytesバイト進める。 */
  next(bytes: number) {
    if (bytes < 0) throw new Error('arg:bytes must be >=0.');
    const subBuffer = this.buf.subarray(this.cur, this.cur + bytes);
    this.cur += bytes;
    return subBuffer;
  }
};
