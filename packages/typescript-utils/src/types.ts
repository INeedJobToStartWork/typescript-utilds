//----------------------
// Branded Types
//----------------------

/** Type for creating brand types */
export type TBrand<T, Brand extends string> = T & { __brand: Brand };

/** Type for regular expression flags @dontexport */
export type TRegExpFlags = "g" | "i" | "m" | "u" | "y";

//----------------------
// Helpers
//----------------------

export type TPrettify<T> = {
	[K in keyof T]: T[K];
	// eslint-disable-next-line @typescript-eslint/ban-types
} & {};

export type TMerge<T> = {
	[K in keyof T]: T[K];
};

//----------------------
// Types
//----------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Class<T = object> = new (...args: any[]) => T;
// export type Class<T = any> = new (...args: any[]) => T;
// export type Class = new (...args: any[]) => any;
