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

/**
 * Value that can be used to interrupt a looping callback
 */
export const enum LoopResult {
	/** The callback should stop iterating */
	StopLooping,
	/** The callback should continue iterating */
	KeepLooping
}

/**
 * Force a never-typed value. Useful to ensure exhaustive switches.
 * @param thing the thing that should never be valued
 * @param otherwise what should be returned if we actually reached this code i.e. to prevent crashes
 * @returns The otherwise value
 */
export function forceNever(thing: never, otherwise?: any): never {
	return otherwise;
}