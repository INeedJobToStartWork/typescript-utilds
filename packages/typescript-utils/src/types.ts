//----------------------
// Branded Types
//----------------------

/** 
 * Type for creating brand types 
 * * @remarks
 * Branding (or Nominal Typing) prevents different types with the same underlying
 * 
 * @example
 * ```ts
 * type UserId = TBrand<string, "UserId">;
 * type OrderId = TBrand<string, "OrderId">;
 * let user: UserId = "123" as UserId;
 * let order: OrderId = "456" as OrderId;
 
 * user = order; // This will cause a TypeScript error, preventing a logic bug
 * ```
 */
export type TBrand<T, Brand extends string> = T & { __brand: Brand };

/** Type for regular expression flags @dontexport */
export type TRegExpFlags = "g" | "i" | "m" | "u" | "y";

//----------------------
// Type Helpers
//----------------------

/** 
 * Prettifies union types.
 * 
 * @remarks Useful for improving the readability of complex, intersected, or mapped types in IDE tooltips.
 * 
 * @description By default, TypeScript often displays intersections (e.g., `A & B`) as a list of 
 * combined types. `TPrettify` forces TypeScript to resolve these intersections 
 * into a single, flat object structure, making it much easier to inspect the 
 * final shape of the type during development.
 * 
 * @example 
 * ```ts
 * type User = { id: string };
 * type WithRole = { role: string };
 * type DetailedUser = User & WithRole; // Without Prettify: Tooltip shows "User & WithRole"
 * type DetailedUser2 = TPrettify<User & WithRole>;   // With Prettify: Tooltip shows "{ id: string; role: string; }"
 * type DetailedUserPrettified = TPrettify<DetailedUser>;   // With Prettify: Tooltip shows "{ id: string; role: string; }"
	```
*/
export type TPrettify<T> = {
	[K in keyof T]: T[K];
	// eslint-disable-next-line @typescript-eslint/ban-types
} & {};

//----------------------
// Types
//----------------------

/**
 * Type for class constructor
 *
 * @remarks
 * This utility type is useful for factory functions, dependency injection containers,
 * or any logic that needs to instantiate a class dynamically. By default, it accepts
 * any number of constructor arguments.
 *
 * @example
 * ```ts
 * const myClassMixin = <T extends Class>(baseClass: T) => class myClass extends baseClass {};
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Class<T = object> = new (...args: any[]) => T;

/**
 * Temporary `any` alias for development purposes.
 *
 *
 * @remarks Use this alias ONLY during initial development or prototyping.
 * @deprecated Use this alias ONLY during initial development or prototyping.
 *
 * @example
 * ```ts
 * function applySettings(settings: TTODO): void {}
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TTODO = any;
