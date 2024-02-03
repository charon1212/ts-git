// 簡易的なResult型

abstract class ResultBase<O, E>{
  abstract unwrap(): O;
};

class ResultOk<O> extends ResultBase<O, never>{
  readonly isOk = true;
  readonly isEr = false;
  constructor(public ok: O) { super(); };
  unwrap(): O { return this.ok; };
}

class ResultEr<E> extends ResultBase<never, E>{
  readonly isOk = false;
  readonly isEr = true;
  constructor(public er: E) { super(); };
  unwrap(): never { throw this.er; };
}

export type Result<O, E> = ResultOk<O> | ResultEr<E>;

type Ok = { (): Result<void, never>; <O>(o: O): Result<O, never>; };
type Er = { (): Result<never, void>; <E>(e: E): Result<never, E>; };

export const ok: Ok = (...arr: unknown[]): ResultOk<any> => arr.length === 0 ? new ResultOk(undefined) : new ResultOk(arr[0]);
export const er: Er = (...arr: unknown[]): ResultEr<any> => arr.length === 0 ? new ResultEr(undefined) : new ResultEr(arr[0]);
