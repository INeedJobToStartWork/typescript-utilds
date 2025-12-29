import type { Class } from "@/types";

//----------------------
// Types
//----------------------

/**
 * Type for a mixin.
 *
 * @remarks
 * This utility type is useful for creating mixins that can be applied to classes.
 *
 */
export type Mixin<TAdded> = <TBase extends Class>(
	Base: TBase
) => new (...args: ConstructorParameters<TBase>) => InstanceType<TBase> & TAdded;

/**
 * Requires a mixin.
 *
 * @remarks
 * This utility type is useful for ensuring that a class extends a specific mixin.
 *
 * @example
 * ```ts
 * class HasHp { hp = 100; }
 * const hasHpMixin = classToMixin(HasHp);
 * const canAttackYourSelfMixin = <T extends Class & RequireMixin<typeof hasHpMixin>>(Base: T) =>
 * 	class canAttackYourSelf extends Base
 * 	{
 * 		canAttack = true;
 * 		attackYourSelf(dmg:number) { this.hp -= dmg; // See HasHp };
 * 	}
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RequireMixin<M extends Mixin<any>> = new (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	...args: any[]
) => ReturnType<M> extends Class<infer I> ? I : never;
