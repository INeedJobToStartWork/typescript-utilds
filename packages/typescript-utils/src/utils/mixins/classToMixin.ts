/* eslint-disable @EslintUnicorn/no-keyword-prefix */
import type { Class } from "@/types";
import type { Mixin } from "./types";

//----------------------
// Types
//----------------------

//----------------------
// Functions
//----------------------

/**
 * Convert a class to a mixin.
 *  
 * @example
 * ```ts
 * class canAttack { attack() { console.log("Attack!"); }}
 * class canFly { fly() { console.log("Fly!"); }}
 * 
 * const canAttackMixin = classToMixin(canAttack);
 * class Player extends canAttackMixin(canFly) {}
 * 
 * const player = new Player();
 * player.attack(); // "Attack!"
 * player.fly(); // "Fly!"
 * ```
 * 
 * @example
 * ```ts
 * class canAttack { attack() { console.log("Attack!"); }}
 * class canFly { fly() { console.log("Fly!"); }}
 * const canAttackMixin = classToMixin(canAttack);
 * const canFlyMixin = classToMixin(canFly);
 * 
 * class Player {}
 * const PlayerWithAttackMixinAndFly = canFlyMixin(canAttackMixin(Player));
 * 
 * const player = new PlayerWithAttackMixinAndFly();
 * player.attack(); // "Attack!"
 * player.fly(); // "Fly!"
 * ```

 * 
 * @param MixinClass The class to convert.
 * @returns The mixin.
*/

export function classToMixin<TAdded extends object>(MixinClass: new () => TAdded): Mixin<TAdded> {
	return function <TBase extends Class>(Base: TBase) {
		class Mixed extends Base {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			constructor(...args: any[]) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				super(...args);
				Object.assign(this, new MixinClass());
			}
		}

		let currentPrototype = MixinClass.prototype as Record<PropertyKey, unknown> | undefined;
		while (currentPrototype && currentPrototype !== Object.prototype) {
			const propertyNames = Object.getOwnPropertyNames(currentPrototype);

			for (const name of propertyNames) {
				if (name === "constructor" || Object.hasOwn(Mixed.prototype, name)) continue;

				const descriptor = Object.getOwnPropertyDescriptor(currentPrototype, name);
				if (descriptor) Object.defineProperty(Mixed.prototype, name, descriptor);
			}

			currentPrototype = Object.getPrototypeOf(currentPrototype) as Record<PropertyKey, unknown>;
		}

		return Mixed as unknown as new (...args: ConstructorParameters<TBase>) => InstanceType<TBase> & TAdded;
	};
}

export default classToMixin;
