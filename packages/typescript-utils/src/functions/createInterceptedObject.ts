import type { Interceptable } from "@/classes";

//----------------------
// Functions
//----------------------

/**
 * Make a proxy object that intercepts property accesses and invokes interceptors.
 */
export function createInterceptedObject<T extends object, GContext extends object>(
	base: T,
	interceptors: { [K in keyof T]?: InstanceType<Interceptable<T[K], GContext>> },
	ctx: GContext = {} as GContext
): T {
	return new Proxy(base, {
		get(target, prop, receiver) {
			const value = Reflect.get(target, prop, receiver);
			const key = prop as keyof T;
			const interceptor = interceptors[key];
			if (interceptor) return interceptor.getValue(value, ctx);

			return value;
		}
	});
}

export default createInterceptedObject;
