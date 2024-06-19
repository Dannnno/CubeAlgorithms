/**
 * Restrict a value to a given numerical range (inclusive)
 * @param value The value to apply the clamp to
 * @param max The largest value allowed (inclusive)
 * @param min The smallest value allowed (inclusive)
 * @returns The value clamped into the range (inclusive)
 */
export function clamp(value: number, max: number, min: number): number {
	return Math.min(Math.max(value, min), max);
}

/**
 * Check if a value is between two numbers
 * @param value The value to check
 * @param max The largest value (exclusive) that is allowed
 * @param min The smallest value (inclusive) that is allowed
 * @returns Whether the value is between the two
 */
export function isClamped(value: number, max: number, min: number): bool {
	return value < max && value >= min;
}

/**
 * Assert that a given value is between two numbers
 * @param value The value to check
 * @param max The largest value (exclusive) that is allowed
 * @param min The smallest value (inclusive) that is allowed
 * @param label A description of the value for error throwing purposes
 * @returns Whether the value is between the two
 */
export function assertIsClamped(value: number, min: number, max: number, label: string): value is number {
	if (value >= max) {
		throw new Error(`${label}=${value} is too large; expected in range [${min}, ${max}).`);
	}
	if (value < min) {
		throw new Error(`${label}=${value} is too small; expected in range [${min}, ${max}).`);
	}
	return true;
}