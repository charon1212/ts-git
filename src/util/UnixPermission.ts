/** Unix権限 */
export type UnixPermission = {
  owner: { r: boolean, w: boolean, x: boolean },
  group: { r: boolean, w: boolean, x: boolean },
  others: { r: boolean, w: boolean, x: boolean },
};

export const getUnixPermissionFromDecimal = (num: number): UnixPermission => {
  return {
    owner: {
      r: (num & (1 << 8)) ? true : false,
      w: (num & (1 << 7)) ? true : false,
      x: (num & (1 << 6)) ? true : false,
    },
    group: {
      r: (num & (1 << 5)) ? true : false,
      w: (num & (1 << 4)) ? true : false,
      x: (num & (1 << 3)) ? true : false,
    },
    others: {
      r: (num & (1 << 2)) ? true : false,
      w: (num & (1 << 1)) ? true : false,
      x: (num & (1 << 0)) ? true : false,
    },
  };
};
export const encodeUnixPermissionToDecimal = (unixPermission: UnixPermission): number => {
  const { owner, group, others } = unixPermission;
  const num =
    (owner.r ? (1 << 8) : 0)
    + (owner.w ? (1 << 7) : 0)
    + (owner.x ? (1 << 6) : 0)
    + (group.r ? (1 << 5) : 0)
    + (group.w ? (1 << 4) : 0)
    + (group.x ? (1 << 3) : 0)
    + (others.r ? (1 << 2) : 0)
    + (others.w ? (1 << 1) : 0)
    + (others.x ? (1 << 0) : 0);
  return num;
};
