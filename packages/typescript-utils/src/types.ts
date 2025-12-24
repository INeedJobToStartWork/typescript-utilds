//----------------------
// Branded Types
//----------------------

/** Type for creating brand types */
export type TBrand<T, Brand extends string> = T & { __brand: Brand };

/** Type for regular expression flags @dontexport */
export type TRegExpFlags = "g" | "i" | "m" | "u" | "y";

//----------------------
// Types
//----------------------

export type TPrettify<T> = {
	[K in keyof T]: T[K];
	// eslint-disable-next-line @typescript-eslint/ban-types
} & {};

export type TMerge<T> = {
	[K in keyof T]: T[K];
};
