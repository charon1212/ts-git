import { inflate, deflate } from "zlib";

/**
 * 参考: <https://www.yoheim.net/blog.php?q=20141002>
 */

/**
 * gzipで圧縮する。
 */
export const zip = async (buf: Buffer): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    deflate(buf, (err, buf) => {
      if (err) reject(err);
      else resolve(buf);
    });
  });
};

/**
 * gzipを解凍する。
 */
export const unzip = async (buf: Buffer): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    inflate(buf, (err, buf) => {
      if (err) reject(err);
      else resolve(buf);
    });
  })
};
