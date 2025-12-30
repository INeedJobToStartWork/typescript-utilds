import type { Class } from "@/types";

//----------------------
// Functions
//----------------------

/**
 * Singleton class decorator.
 *
 * @remarks
 * This decorator ensures that a class has only one instance throughout the application.
 * Any subsequent instantiation of the class will return the same instance.
 *
 * @example
 * ```ts
 * @Singleton
 * class MyClass {}
 *
 * const instance1 = new MyClass();
 * const instance2 = new MyClass();
 * console.log(instance1 === instance2); // true
 * ```
 *
 */
export const Singleton = <T extends Class>(Base: T = class {} as T) =>
	class Singleton extends Base {
		static instance: Singleton | undefined = void 0;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		constructor(...args: any[]) {
			// eslint-disable-next-line no-constructor-return
			if (Singleton.instance) return Singleton.instance;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			super(...args);
			Singleton.instance = this;
		}
	};

export default Singleton;
