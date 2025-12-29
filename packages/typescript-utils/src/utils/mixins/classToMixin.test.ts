/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable new-cap */
/* eslint-disable max-classes-per-file */
import { describe, it, expect } from "vitest";
// eslint-disable-next-line @EslintUnicorn/no-keyword-prefix
import { classToMixin } from "@/utils";

describe("classToMixin", () => {
	it("should merge methods from a simple class into a base class", () => {
		class CanSayHello {
			sayHello() {
				return "Hello";
			}
		}
		class Base {}

		const CanSayHelloMixin = classToMixin(CanSayHello);
		const MixedClass = CanSayHelloMixin(Base);
		const instance = new MixedClass();

		expect(instance.sayHello()).toBe("Hello");
	});

	it("should copy instance properties (fields) correctly", () => {
		class HasEnergy {
			energy = 100;
			burn() {
				this.energy -= 10;
			}
		}
		class Base {}

		const HasEnergyMixin = classToMixin(HasEnergy);
		const MixedClass = HasEnergyMixin(Base);
		const instance = new MixedClass();

		expect(instance.energy).toBe(100);
		instance.burn();
		expect(instance.energy).toBe(90);
	});

	it("should support deep inheritance in the mixin class", () => {
		class GrandParent {
			grandMethod() {
				return "grand";
			}
		}
		class Parent extends GrandParent {
			parentMethod() {
				return "parent";
			}
		}
		class Base {}

		const ParentMixin = classToMixin(Parent);
		const MixedClass = ParentMixin(Base);
		const instance = new MixedClass();

		expect(instance.parentMethod()).toBe("parent");
		expect(instance.grandMethod()).toBe("grand");
	});

	it("should not let parent methods override child methods during copy", () => {
		class Parent {
			id() {
				return "parent";
			}
		}
		class Child extends Parent {
			// @ts-expect-error: Override method 'id' in class 'Parent'. We know that but we want to test that it works.
			id() {
				return "child";
			}
		}
		class Base {}

		const ChildMixin = classToMixin(Child);
		const MixedClass = ChildMixin(Base);
		const instance = new MixedClass();

		expect(instance.id()).toBe("child");
	});

	it("should copy getters and setters correctly", () => {
		class StateHolder {
			private _val = 0;
			get val() {
				return this._val;
			}
			set val(v: number) {
				this._val = v * 2;
			}
		}
		class Base {}

		const StateMixin = classToMixin(StateHolder);
		const MixedClass = StateMixin(Base);
		const instance = new MixedClass();

		instance.val = 5;
		expect(instance.val).toBe(10);
	});

	it("should preserve base class constructor behavior", () => {
		class Base {
			name: string;
			constructor(name: string) {
				this.name = name;
			}
		}
		class Extra {
			extra = true;
		}

		const ExtraMixin = classToMixin(Extra);
		const MixedClass = ExtraMixin(Base);

		const instance = new MixedClass("TestUser");

		expect(instance.name).toBe("TestUser");
		expect(instance.extra).toBe(true);
	});
});
