/* eslint-disable @EslintUnicorn/no-array-reduce */
import type { Class } from "@/types";
import type { Mixin } from "./types";
// eslint-disable-next-line @EslintUnicorn/no-keyword-prefix
import { classToMixin } from "@/utils";

//----------------------
// Types
//----------------------

type AddedOf<M> = M extends Mixin<infer A> ? A : never;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

//----------------------
// Functions
//----------------------

/**
 * Mixin all mixins and classes.
 *
 * @remarks It does not shows error of missing mixin needed for XYZ.
 *
 * @example
 * ```ts
 * import {canFlyMixin,canAttackMixin} from "@/fake/mixins";
 *
 * class Player extends mixinAll([canFlyMixin,canAttackMixin] as const) {} // if canAttack would require `hp` stat from previous class he wouldn't warn it.
 *
 * const player = new Player();
 * player.attack(); // "Attack!"
 * player.fly(); // "Fly!"
 * ```
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function mixinAll<TMixins extends Array<Class | Mixin<any>>>(classesOrMixins: TMixins) {
	type Added = UnionToIntersection<
		AddedOf<
			{
				[K in keyof TMixins]: TMixins[K] extends Mixin<infer A>
					? Mixin<A>
					: TMixins[K] extends Class<infer A>
						? Mixin<A>
						: never;
			}[number]
		>
	>;

	const BaseClass = classesOrMixins.reduce<Class>(
		(Base, item) => {
			if (typeof item === "function" && item.prototype) return classToMixin(item as any)(Base);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
			return (item as any)(Base);
		},
		class {}
	);

	return BaseClass as new () => Added;
}

export default mixinAll;
