//----------------------
// CONSTANTS
//----------------------

/** @internal @dontexport */
const DEFAULT_VALUES = {
	priority: 0
} as const;

//----------------------
// Types
//----------------------

type TInterceptor<GValueType, GContext extends object> = {
	interceptor: (value: GValueType, ctx: GContext) => GValueType;
	priority: number;
	tag?: string;
};

//----------------------
// Classes
//----------------------

/**
 * Class for intercepting values.
 *
 * @example
 * ```ts
 * const stats = {
 * 	hp:100,
 * 	dmg:5,
 * };
 * const interceptors = {
 * 	hp:new Interceptable<number, object>(),
 * 	dmg:new Interceptable<number, object>(),
 * };
 * // Add Interceptors
 * interceptors.hp.add((value, ctx) => value * 2);
 * interceptors.dmg.add((value, ctx) => value + 10);
 * // Get Intercepted Values
 * console.log(interceptors.hp.getValue(stats,stats.hp)); // 200
 * console.log(interceptors.dmg.getValue(stats,stats.dmg)); // 15
 * ```
 */
export class Interceptable<GValueType, GContext extends object> {
	//----
	// Variables
	//----

	private interceptors: Array<TInterceptor<GValueType, GContext>> = [];

	//----
	// Constructor
	//----

	// constructor(public initialValue?: GValueType) {}

	//----
	// Methods
	//----

	/**
	 * Add an interceptor to the list of interceptors.
	 * @param interceptorInputed The interceptor to add.
	 * @returns The instance of the class.
	 */
	public add(
		...interceptorInputed: Array<TInterceptor<GValueType, GContext> | TInterceptor<GValueType, GContext>["interceptor"]>
	): this {
		for (const interceptor of interceptorInputed) {
			const { interceptor: interceptorNormalized, priority, tag } = this.normalizeInterceptor(interceptor);
			this.interceptors.push({
				interceptor: interceptorNormalized,
				priority,
				tag
			});
		}
		this.interceptors.sort((a, b) => a.priority - b.priority);
		return this;
	}

	/**
	 * Add an interceptor to the list of interceptors that will be called only once.
	 * @param interceptor The interceptor to add.
	 * @returns The instance of the class.
	 */
	public once(...interceptorInputed: Parameters<this["add"]>): this {
		const results: Array<Parameters<this["add"]>[number]> = [];
		for (const interceptor of interceptorInputed) {
			const { interceptor: interceptorNormalized, ...restParameters } = this.normalizeInterceptor(interceptor);
			const wrapper = (value: GValueType, ctx: GContext) => {
				this.remove(wrapper);
				return interceptorNormalized(value, ctx);
			};
			results.push({ interceptor: wrapper, ...restParameters });
		}

		this.add(...results);

		return this;
	}

	/**
	 * Remove the first interceptor from the list of interceptors.
	 * @param interceptor The interceptor to remove.
	 * @returns The instance of the class.
	 */
	public remove(interceptor: TInterceptor<GValueType, GContext>["interceptor"]): boolean {
		// this.listeners = this.listeners.filter(listener => listener.interceptor !== interceptor);
		// return this;

		const idx = this.interceptors.findIndex(el => el.interceptor === interceptor);
		if (idx < 0) return false;

		this.interceptors.splice(idx, 1);
		return true;
	}

	/**
	 * Remove the first interceptor with the specified tag from the list of interceptors.
	 * @param tag The tag of the interceptors to remove.
	 * @returns True if the interceptor was removed, false otherwise.
	 */
	public removeByTag(tag: TInterceptor<GValueType, GContext>["tag"]): boolean {
		// this.listeners = this.listeners.filter(listener => listener.tag !== tag);

		const idx = this.interceptors.findIndex(el => el.tag === tag);
		if (idx < 0) return false;

		this.interceptors.splice(idx, 1);
		return true;
	}
	/**
	 * Remove all interceptors with the specified tag from the list of interceptors.
	 * @param tag The tag of the interceptors to remove.
	 * @returns The number of interceptors removed.
	 */
	public removeAllByTag(tag: TInterceptor<GValueType, GContext>["tag"]): number {
		const initialLength = this.interceptors.length;
		this.interceptors = this.interceptors.filter(listener => listener.tag !== tag);
		return initialLength - this.interceptors.length;
	}

	/**
	 * Clear all interceptors from the list of interceptors.
	 * @returns The instance of the class.
	 */
	public clear(): this {
		this.interceptors = [];
		return this;
	}

	/**
	 * Get the value after applying all interceptors.
	 *
	 * If you don't want to use every time `getValue`, you can use `{createInterceptedObject}` instead.
	 *
	 * @param initialValue The initial value.
	 * @param ctx The context.
	 * @returns The value after applying all interceptors.
	 *
	 * @link @{createInterceptedObject}
	 */
	public getValue(initialValue: GValueType, ctx: Readonly<GContext>): GValueType {
		// eslint-disable-next-line @EslintPrefArrayFunc/prefer-array-from, @EslintUnicorn/no-array-reduce
		return [...this.interceptors].reduce((value, listener) => listener.interceptor(value, ctx), initialValue);
	}

	/** Normalizer For Shorthands */
	// eslint-disable-next-line class-methods-use-this
	private normalizeInterceptor(
		interceptorInputed: TInterceptor<GValueType, GContext> | TInterceptor<GValueType, GContext>["interceptor"]
	): TInterceptor<GValueType, GContext> {
		if (typeof interceptorInputed === "function") return { ...DEFAULT_VALUES, interceptor: interceptorInputed };
		return {
			...DEFAULT_VALUES,
			...interceptorInputed
		};
	}
}

export default Interceptable;
