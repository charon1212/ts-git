import { BinaryLike, createHash } from "crypto";

export const createSha1 = (data: BinaryLike) => {
  const sha1 = createHash("sha1").update(data).digest("hex");
  if (sha1.length !== sha1Length) throw new Error(`sha1の長さが${sha1Length}でない`);
  return sha1;
}
export const sha1Length = 40;
