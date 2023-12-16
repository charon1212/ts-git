import { gzip, gunzip } from "zlib";

/**
 * 参考: <https://www.yoheim.net/blog.php?q=20141002>
 */

/**
 * gzipで圧縮する。
 */
export const zip = async (buf: Buffer): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    gzip(buf, (err, buf) => {
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
    gunzip(buf, (err, buf) => {
      if (err) reject(err);
      else resolve(buf);
    });
  })
};
