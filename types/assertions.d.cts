export type ErrorConstructor<ErrorType extends Error = Error> = {
	readonly prototype: ErrorType;
	new (...args: any[]): ErrorType;
};

export type ThrownError<ErrorType extends ErrorConstructor | Error> = ErrorType extends ErrorConstructor ? ErrorType['prototype'] : ErrorType;

/** Specify one or more expectations the thrown error must satisfy. */
export type ThrowsExpectation<ErrorType extends ErrorConstructor | Error> = {
	/** If true, the thrown error is not required to be a native error. */
	any?: false;

	/** The thrown error must have a code that equals the given string or number. */
	code?: string | number;

	/** The thrown error must be an instance of this constructor. */
	instanceOf?: ErrorType extends ErrorConstructor ? ErrorType : ErrorType extends Error ? ErrorConstructor<ErrorType> : never;

	/** The thrown error must be strictly equal to this value. */
	is?: ErrorType extends ErrorConstructor ? ErrorType['prototype'] : ErrorType;

	/** The thrown error must have a message that equals the given string, or matches the regular expression. */
	message?: string | RegExp | ((message: string) => boolean);

	/** The thrown error must have a name that equals the given string. */
	name?: string;
};

export type ThrowsAnyExpectation = Omit<ThrowsExpectation<any>, 'any' | 'instanceOf' | 'is'> & {
	/** If true, the thrown error is not required to be a native error. */
	any: true;

	/** The thrown error must be an instance of this constructor. */
	instanceOf?: new (...args: any[]) => any;

	/** The thrown error must be strictly equal to this value. */
	is?: any;
};

export type Assertions = {
	/**
	 * Assert that `actual` is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), returning a boolean
	 * indicating whether the assertion passed.
	 *
	 * Note: An `else` clause using this as a type guard will be subtly incorrect for `string` and `number` types and will not give `0` or `''` as a potential value in an `else` clause.
	 */
	assert: AssertAssertion;

	/**
	 * Assert that `actual` is [deeply equal](https://github.com/concordancejs/concordance#comparison-details) to
	 * `expected`, returning a boolean indicating whether the assertion passed.
	 */
	deepEqual: DeepEqualAssertion;

	/**
	 * Assert that `value` is like `selector`, returning a boolean indicating whether the assertion passed.
	 */
	like: LikeAssertion;

	/** Fail the test, always returning `false`. */
	fail: FailAssertion;

	/**
	 * Assert that `actual` is strictly false, returning a boolean indicating whether the assertion passed.
	 */
	false: FalseAssertion;

	/**
	 * Assert that `actual` is [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), returning a boolean
	 * indicating whether the assertion passed.
	 */
	falsy: FalsyAssertion;

	/**
	 * Assert that `actual` is [the same
	 * value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) as `expected`,
	 * returning a boolean indicating whether the assertion passed.
	 */
	is: IsAssertion;

	/**
	 * Assert that `actual` is not [the same
	 * value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) as `expected`,
	 * returning a boolean indicating whether the assertion passed.
	 */
	not: NotAssertion;

	/**
	 * Assert that `actual` is not [deeply equal](https://github.com/concordancejs/concordance#comparison-details) to
	 * `expected`, returning a boolean indicating whether the assertion passed.
	 */
	notDeepEqual: NotDeepEqualAssertion;

	/**
	 * Assert that `string` does not match the regular expression, returning a boolean indicating whether the assertion
	 * passed.
	 */
	notRegex: NotRegexAssertion;

	/** Assert that the function does not throw. */
	notThrows: NotThrowsAssertion;

	/** Assert that the async function does not throw, or that the promise does not reject. Must be awaited. */
	notThrowsAsync: NotThrowsAsyncAssertion;

	/** Count a passing assertion, always returning `true`. */
	pass: PassAssertion;

	/**
	 * Assert that `string` matches the regular expression, returning a boolean indicating whether the assertion passed.
	 */
	regex: RegexAssertion;

	/**
	 * Assert that `expected` is [deeply equal](https://github.com/concordancejs/concordance#comparison-details) to a
	 * previously recorded [snapshot](https://github.com/concordancejs/concordance#serialization-details), or if
	 * necessary record a new snapshot.
	 */
	snapshot: SnapshotAssertion;

	/**
	 * Assert that the function throws a native error. If so, returns the error value.
	 */
	throws: ThrowsAssertion;

	/**
	 * Assert that the async function throws a native error, or the promise rejects
	 * with one. If so, returns a promise for the error value, which must be awaited.
	 */
	throwsAsync: ThrowsAsyncAssertion;

	/**
	 * Assert that `actual` is strictly true, returning a boolean indicating whether the assertion passed.
	 */
	true: TrueAssertion;

	/**
	 * Assert that `actual` is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), returning a boolean
	 * indicating whether the assertion passed.
	 *
	 * Note: An `else` clause using this as a type guard will be subtly incorrect for `string` and `number` types and will not give `0` or `''` as a potential value in an `else` clause.
	 */
	truthy: TruthyAssertion;
};

type FalsyValue = false | 0 | 0n | '' | undefined;
type Falsy<T> = T extends Exclude<T, FalsyValue> ? (T extends number | string | bigint ? T & FalsyValue : never) : T;

export type AssertAssertion = {
	/**
	 * Assert that `actual` is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), returning `true` if the
	 * assertion passed and throwing otherwise.
	 *
	 * Note: An `else` clause using this as a type guard will be subtly incorrect for `string` and `number` types and will
	 * not give `0` or `''` as a potential value in an `else` clause.
	 */
	<T>(actual: T, message?: string): actual is T extends Falsy<T> ? never : T;

	/** Skip this assertion. */
	skip(actual: any, message?: string): void;
};

export type DeepEqualAssertion = {
	/**
	 * Assert that `actual` is [deeply equal](https://github.com/concordancejs/concordance#comparison-details) to
	 * `expected`, returning `true` if the assertion passed and throwing otherwise.
	 */
	<Actual, Expected extends Actual>(actual: Actual, expected: Expected, message?: string): actual is Expected;

	/**
	 * Assert that `actual` is [deeply equal](https://github.com/concordancejs/concordance#comparison-details) to
	 * `expected`, returning `true` if the assertion passed and throwing otherwise.
	 */
	<Actual extends Expected, Expected>(actual: Actual, expected: Expected, message?: string): expected is Actual;

	/**
	 * Assert that `actual` is [deeply equal](https://github.com/concordancejs/concordance#comparison-details) to
	 * `expected`, returning `true` if the assertion passed and throwing otherwise.
	 */
	<Actual, Expected>(actual: Actual, expected: Expected, message?: string): boolean;

	/** Skip this assertion. */
	skip(actual: any, expected: any, message?: string): void;
};

export type LikeAssertion = {
	/**
	 * Assert that `value` is like `selector`, returning `true` if the assertion passed and throwing otherwise.
	 */
	<Expected extends Record<string, any>>(value: any, selector: Expected, message?: string): value is Expected;

	/** Skip this assertion. */
	skip(value: any, selector: any, message?: string): void;
};

export type FailAssertion = {
	/** Fail the test. */
	(message?: string): never;

	/** Skip this assertion. */
	skip(message?: string): void;
};

export type FalseAssertion = {
	/**
	 * Assert that `actual` is strictly false, returning `true` if the assertion passed and throwing otherwise.
	 */
	(actual: any, message?: string): actual is false;

	/** Skip this assertion. */
	skip(actual: any, message?: string): void;
};

export type FalsyAssertion = {
	/**
	 * Assert that `actual` is [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), returning `true` if the
	 * assertion passed and throwing otherwise.
	 */
	<T>(actual: T, message?: string): actual is Falsy<T>;

	/** Skip this assertion. */
	skip(actual: any, message?: string): void;
};

export type IsAssertion = {
	/**
	 * Assert that `actual` is [the same
	 * value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) as `expected`,
	 * returning `true` if the assertion passed and throwing otherwise.
	 */
	<Actual, Expected extends Actual>(actual: Actual, expected: Expected, message?: string): actual is Expected;

	/** Skip this assertion. */
	skip(actual: any, expected: any, message?: string): void;
};

export type NotAssertion = {
	/**
	 * Assert that `actual` is not [the same
	 * value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) as `expected`,
	 * returning `true` if the assertion passed and throwing otherwise.
	 */
	<Actual, Expected>(actual: Actual, expected: Expected, message?: string): true;

	/** Skip this assertion. */
	skip(actual: any, expected: any, message?: string): void;
};

export type NotDeepEqualAssertion = {
	/**
	 * Assert that `actual` is not [deeply equal](https://github.com/concordancejs/concordance#comparison-details) to
	 * `expected`, returning `true` if the assertion passed and throwing otherwise.
	 */
	<Actual, Expected>(actual: Actual, expected: Expected, message?: string): true;

	/** Skip this assertion. */
	skip(actual: any, expected: any, message?: string): void;
};

export type NotRegexAssertion = {
	/**
	 * Assert that `string` does not match the regular expression, returning `true` if the assertion passed and throwing
	 * otherwise.
	 */
	(string: string, regex: RegExp, message?: string): true;

	/** Skip this assertion. */
	skip(string: string, regex: RegExp, message?: string): void;
};

export type NotThrowsAssertion = {
	/**
	 * Assert that the function does not throw, returning `true` if the assertion passed and throwing otherwise.
	 */
	(fn: () => any, message?: string): true;

	/** Skip this assertion. */
	skip(fn: () => any, message?: string): void;
};

export type NotThrowsAsyncAssertion = {
	/**
	 * Assert that the async function does not throw, returning a promise for `true` if the assertion passesd and a
	 * rejected promise otherwise.
	 *
	 * You must await the result.
	 */
	(fn: () => PromiseLike<any>, message?: string): Promise<true>;

	/** Assert that the promise does not reject, returning a promise for `true` if the assertion passesd and a
	 * rejected promise otherwise.
	 *
	 * You must await the result.
	 */
	(promise: PromiseLike<any>, message?: string): Promise<true>;

	/** Skip this assertion. */
	skip(nonThrower: any, message?: string): void;
};

export type PassAssertion = {
	/** Count a passing assertion, always returning `true`. */
	(message?: string): true;

	/** Skip this assertion. */
	skip(message?: string): void;
};

export type RegexAssertion = {
	/**
	 * Assert that `string` matches the regular expression, returning `true` if the assertion passed and throwing
	 * otherwise.
	 */
	(string: string, regex: RegExp, message?: string): true;

	/** Skip this assertion. */
	skip(string: string, regex: RegExp, message?: string): void;
};

export type SnapshotAssertion = {
	/**
	 * Assert that `expected` is [deeply equal](https://github.com/concordancejs/concordance#comparison-details) to a
	 * previously recorded [snapshot](https://github.com/concordancejs/concordance#serialization-details), or if
	 * necessary record a new snapshot.
	 *
	 * Returns `true` if the assertion passed and throws otherwise.
	 */
	(expected: any, message?: string): true;

	/** Skip this assertion. */
	skip(expected: any, message?: string): void;
};

export type ThrowsAssertion = {
	/**
	 * Assert that the function throws a native error. The error must satisfy all expectations. Returns the error value if
	 * the assertion passes and throws otherwise.
	 */
	<ErrorType extends ErrorConstructor | Error>(fn: () => any, expectations?: ThrowsExpectation<ErrorType>, message?: string): ThrownError<ErrorType>;

	/**
	 * Assert that the function throws. The error must satisfy all expectations. Returns the error value if the assertion
	 * passes and throws otherwise.
	 */
	(fn: () => any, expectations?: ThrowsAnyExpectation, message?: string): unknown;

	/** Skip this assertion. */
	skip(fn: () => any, expectations?: any, message?: string): void;
};

export type ThrowsAsyncAssertion = {
	/**
	 * Assert that the async function throws a native error. You must await the result. The error must satisfy all
	 * expectations. Returns a promise for the error value if the assertion passes and a rejected promise otherwise.
	 */
	<ErrorType extends ErrorConstructor | Error>(fn: () => PromiseLike<any>, expectations?: ThrowsExpectation<ErrorType>, message?: string): Promise<ThrownError<ErrorType>>;

	/**
	 * Assert that the promise rejects with a native error. You must await the result. The error must satisfy all
	 * expectations. Returns a promise for the error value if the assertion passes and a rejected promise otherwise.
	 */
	<ErrorType extends ErrorConstructor | Error>(promise: PromiseLike<any>, expectations?: ThrowsExpectation<ErrorType>, message?: string): Promise<ThrownError<ErrorType>>;

	/**
	 * Assert that the async function throws. You must await the result. The error must satisfy all expectations. Returns
	 * a promise for the error value if the assertion passes and a rejected promise otherwise.
	 */
	(fn: () => PromiseLike<any>, expectations?: ThrowsAnyExpectation, message?: string): Promise<unknown>;

	/**
	 * Assert that the promise rejects. You must await the result. The error must satisfy all expectations. Returns a
	 * promise for the error value if the assertion passes and a rejected promise otherwise.
	 */
	(promise: PromiseLike<any>, expectations?: ThrowsAnyExpectation, message?: string): Promise<unknown>;

	/** Skip this assertion. */
	skip(thrower: any, expectations?: any, message?: string): void;
};

export type TrueAssertion = {
	/**
	 * Assert that `actual` is strictly true, returning `true` if the assertion passed and throwing otherwise.
	 */
	(actual: any, message?: string): actual is true;

	/** Skip this assertion. */
	skip(actual: any, message?: string): void;
};

export type TruthyAssertion = {
	/**
	 * Assert that `actual` is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), returning `true` if the
	 * assertion passed and throwing otherwise.
	 *
	 * Note: An `else` clause using this as a type guard will be subtly incorrect for `string` and `number` types and will
	 * not give `0` or `''` as a potential value in an `else` clause.
	 */
	<T>(actual: T, message?: string): actual is T extends Falsy<T> ? never : T;

	/** Skip this assertion. */
	skip(actual: any, message?: string): void;
};
