/**
 * Exclude keys of type Bad from T
 * @example
 * ```tsx
 * type T = { a: string; b: number; c: undefined, d?: never, e: never };
 * type X = ExcludeKeysOf<T> // "a" | "b" | "c" | "d"
 * type X = ExcludeKeysOf<T, undefined> // "a" | "b"
 * type Z = ExcludeKeysOf<T, string> // "b" | "c" | "d"
 * ```
 */
export type ExcludeKeysOf<T, Bad = never> = {
  [K in keyof T & string]: T[K] extends Bad ? never : K & string;
}[keyof T & string];

/**
 * Exclude keys of type Bad from T
 * @example
 * ```tsx
 * type T = { a: string; b: number; c: undefined, d?: never, e: never };
 * type X = ExcludeValues<T> // { a: string; b: number; c: undefined; d?: never | undefined; }
 * type Y = ExcludeValues<T, undefined> // { a: string; b: number; }
 * type Z = ExcludeValues<T, string> // { b: number; c: undefined; d?: never | undefined; }
 * ```
 */
export type ExcludeValues<T, Bad = never> = Pick<T, ExcludeKeysOf<T, Bad>>;

/**
 * Exclude undefined-like (not null!) types from T
 * @example
 * ```tsx
 * type X = ExcludeMissing<{ a: string; b: number; c: undefined, d?: never }> // { a: string; b: number; }
 * type Y = ExcludeMissing<{ a: string; b: null }> // { a: string; b: null; }
 * ```
 */
export type ExcludeMissing<T> = ExcludeValues<T, undefined>;

/**
 * Get the values of T
 * @example
 * ```tsx
 * type X = ValuesOf<{ a: string; b: number; c: undefined, d?: never }> // string | number | undefined
 * type Y = ValuesOf<{ a: string; b: null }> // string | null
 * type Z = ValuesOf<Record<string, 'abc'>> // 'abc'
 * ```
 */
export type ValuesOf<T> = T[keyof T];

/**
 * Represents a function.
 * First argument is a ReturnType,
 * Second is an arguments
 * @example
 * ```tsx
 * type X = AnyFn<string, [string, number]> // (a: string, b: number) => string
 * type X = AnyFn<MyType> // (...args: any[]) => MyType
 * type X = AnyFn // (...args: any[]) => any
 * ```
 */
// any is to align with arguments contravariance https://en.wikipedia.org/wiki/Covariance_and_contravariance_(computer_science)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFn<T = unknown, A extends unknown[] = any[]> = (...args: A) => T;

/**
 * Get the return type of an async function
 * @example
 * ```tsx
 * type X = AsyncReturn<() => Promise<string>> // string
 * type Y = AsyncReturn<async () => number> // number
 * type Z = AsyncReturn<() => ({ abc: 123 })> // { abc: 123 }
 * ```
 */
export type AsyncReturn<Fn extends AnyFn> = Fn extends AnyFn<infer T>
  ? Awaited<T>
  : never;

/**
 * Convert undefined to never
 * @example
 * ```tsx
 * type X = UndefToNever<undefined> // never
 * ```
 */
export type UndefToNever<T> = T extends undefined ? never : T;

/**
 * Get the first argument of a function
 * @example
 * ```tsx
 * type Y = Arg0<(a: { my: 1, type: 2 }) => void> // { my: 1, type: 2 }
 * type X = Arg0<(a: string, b: number) => void> // string
 * type X = Arg0<() => void> // never
 * ```
 */
export type Arg0<T extends AnyFn> = UndefToNever<Parameters<T>[0]>;

/**
 * Get the second argument of a function
 * @example
 * ```tsx
 * type A3 = Arg1<(a: string, b: number, abc: boolean) => void> // number
 * type A2 = Arg1<(a: string, b: number) => void> // number
 * type A1 = Arg1<(a: MyType) => void> // never
 * type A0 = Arg1<() => void> // never
 * ```
 */
export type Arg1<T extends AnyFn> = UndefToNever<Parameters<T>[1]>;

/**
 * Get Same as Arg1, but takes 3rd argument
 * @example
 * ```tsx
 * type A3 = Arg2<(a: string, b: number, abc: boolean) => void> // boolean
 * type A2 = Arg2<(a: string, b: number) => void> // never
 * type A1 = Arg2<(a: MyType) => void> // never
 * type A0 = Arg2<() => void> // never
 * ```
 */
export type Arg2<T extends AnyFn> = UndefToNever<Parameters<T>[2]>;

/**
 * Converts an enum to a union of its values
 * @example
 * ```tsx
 * enum MyEnum { my = 'my', type = 'type', abc = 'abc' }
 * type X = EnumToPrimitiveUnion<MyEnum> // "my" | "type" | "abc"
 *
 * enum MyEnum2 { my, type, abc }
 * type X = EnumToPrimitiveUnion<MyEnum2> // 0 | 1 | 2
 *
 * enum MyEnum3 { my = 10, type, abc }
 * type Z = EnumToPrimitiveUnion<MyEnum3> // 10 | 11 | 12
 * ```
 */
export type EnumToPrimitiveUnion<T> =
  | `${T & string}`
  | ParseNumber<`${T & number}`>;

/**
 * Parse a number from a string
 * @example
 * ```tsx
 * type X = ParseNumber<'123'> // 123
 * type Y = ParseNumber<'abc'> // never
 * ```
 */
export type ParseNumber<T> = T extends `${infer U extends number}` ? U : never;

/**
 * Makes some keys of T optional
 * @example
 * ```tsx
 * type X = PartialByKey<{ a: string; b: number;  }, 'a'> // { a?: string;  b: number; }
 * ```
 */
export type PartialByKey<T, K extends keyof T = keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

/**
 * Makes all keys of T optional except K
 * @example
 * ```tsx
 * type X = PartialExceptKey<{ a: string; b: number;  }, 'a'> // { a: string;  b?: number; }
 * ```
 */
export type PartialExceptKey<T, K extends keyof T> = Partial<Omit<T, K>> &
  Required<Pick<T, K>>;

/**
 * Get the overlap of two keys
 * @example
 * ```tsx
 * type X = OverlapKeys<{ a: string; b: number; }, { a: string; c: boolean; }> // "a"
 * ```
 */
export type OverlapKeys<T1, T2> = keyof T1 & keyof T2;

/**
 * Merge two types
 * @example
 * ```tsx
 * type X = Merge<{ a: string; b: number; }, { a: string; c: boolean; }> // { a: string; b: number; c: boolean; }
 * type X = Merge<{ a: A1; b: number; }, { a: A2; c: boolean; }> // { a: A1 | A2; b: number; c: boolean; }
 * ```
 */
export type Merge<T1, T2> = {
  [K in OverlapKeys<T1, T2>]: T1[K] | T2[K];
} & {
  [K in Exclude<keyof T1, keyof T2>]?: T1[K];
} & {
  [K in Exclude<keyof T2, keyof T1>]?: T2[K];
};

/**
 * Get the value of a PromiseSettledResult
 * @example
 * ```tsx
 * type X = PromiseSettledValue<PromiseFulfilledResult<string>> // string
 * type Y = PromiseSettledValue<PromiseRejectedResult, number> // number
 * ```
 */
export type PromiseSettledValue<
  T extends PromiseSettledResult<unknown>,
  Rej = never,
> = T extends PromiseFulfilledResult<infer V> ? V : Rej;

/**
 * Asserts that a condition is true
 * @example
 * ```tsx
 * type X = AssertsWith<string>;
 * type Y = AssertsWith<Error>;
 * ```
 */
export type AssertsWith<T> = (
  condition: unknown,
  thing: T,
) => asserts condition;

/**
 * Adds as placeholder the missing properties of P
 * Use if you need to state this property is missing
 * @example
 * ```tsx
 * type X = MissingProps<{ a: string; b: number; }> // { a?: never; b?: never; }
 * ```
 */
export type MissingProps<P> = Partial<Record<keyof P, void>>;
