import type { Class } from "@/types";

//----------------------
// Types
//----------------------

export type Mixin<TAdded> = <TBase extends Class>(
	Base: TBase
) => new (...args: ConstructorParameters<TBase>) => InstanceType<TBase> & TAdded;

/**
 * Requires a mixin.
 *
 * @example
 * ```ts
 * class HasHp { hp = 100; }
 * const canAttackMixin = (Base: Class) => class extends Base { canAttack = true; };
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RequireMixin<M extends Mixin<any>> = new (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	...args: any[]
) => ReturnType<M> extends Class<infer I> ? I : never;
