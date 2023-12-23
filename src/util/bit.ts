/**
 * xを2進数表現した時、start桁～end桁を取得する。
 *
 * @example
 *
 * ```ts
 * const x1 = 0b110010; // 50
 * getBits(x1, 0,2).toString(2); // '10'
 * getBits(x1, 0,4).toString(2); // '10'
 * getBits(x1, 0,5).toString(2); // '10010'
 * getBits(x1, 0,6).toString(2); // '110010'
 * getBits(x1, 1,2).toString(2); // '1'
 * getBits(x1, 1,4).toString(2); // '1'
 * getBits(x1, 1,5).toString(2); // '1001'
 * getBits(x1, 1,6).toString(2); // '11001'
 * getBits(x1, 3,6).toString(2); // '110'
 * ```
 */
export const getBits = (x: number, start: number, end: number) => (x & ((1 << end) - 1)) >> start;
