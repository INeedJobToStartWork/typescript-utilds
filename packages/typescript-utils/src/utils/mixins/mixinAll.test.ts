/* eslint-disable max-classes-per-file */
import { describe, it, expect } from "vitest";
import { mixinAll } from "@/utils";

describe("mixinAll", () => {
	it("should merge multiple classes into the base class", () => {
		class CanWalk {
			walk() {
				return "walking";
			}
		}
		class CanSwim {
			swim() {
				return "swimming";
			}
		}
		class Base {
			id = 1;
		}

		const SuperHero = mixinAll([Base, CanWalk, CanSwim] as const);
		const instance = new SuperHero();

		expect(instance.id).toBe(1);
		expect(instance.walk()).toBe("walking");
		expect(instance.swim()).toBe("swimming");
	});

	it("should respect the order of mixins (last one wins in case of conflict)", () => {
		class Version1 {
			getVersion() {
				return "v1";
			}
		}
		class Version2 {
			getVersion() {
				return "v2";
			}
		}
		class Base {}

		const FinalClass = mixinAll([Base, Version1, Version2] as const);
		const instance = new FinalClass();

		expect(instance.getVersion()).toBe("v2");
	});

	it("should initialize instance properties from all mixins", () => {
		class Stats {
			hp = 100;
		}
		class Position {
			x = 0;
			y = 0;
		}
		class Entity {}

		const Actor = mixinAll([Entity, Stats, Position] as const);
		const instance = new Actor();

		expect(instance.hp).toBe(100);
		expect(instance.x).toBe(0);
		expect(instance.y).toBe(0);
	});

	it("should support mixins that have their own inheritance", () => {
		class Level1 {
			l1() {
				return 1;
			}
		}
		class Level2 extends Level1 {
			l2() {
				return 2;
			}
		}
		class Base {}

		const Result = mixinAll([Base, Level2] as const);
		const instance = new Result();

		expect(instance.l1()).toBe(1);
		expect(instance.l2()).toBe(2);
	});

	it("should preserve symbols when using multiple mixins", () => {
		const sym = Symbol("test");
		class HasSymbol {
			[sym] = "value";
		}
		class Base {}

		const Combined = mixinAll([Base, HasSymbol] as const);
		const instance = new Combined();

		expect(instance[sym]).toBe("value");
	});
});
