/**
 * Generic type that can be used to enforce a number is positive.
 * This doesn't work if the value is not a literal
 * @typeparam N the literal numeric type in use
 * @returns N if it doesn't look like a negative number, otherwise never
 */
export type AssertPositive<N extends number> =
	N extends 0 
		? never 
		: `${N}` extends `-${string}` 
			? never
			: N;
