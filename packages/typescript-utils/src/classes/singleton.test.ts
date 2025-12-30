import { describe, it, expect } from "vitest";
import { Singleton } from "@/classes";

describe("Singleton Decorator & Mixin Tests", () => {
	it('should work as a Class Decorator (The "Chad" Case)', () => {
		@Singleton
		class Player {
			constructor(public name?: string) {}
		}

		const p1 = new Player("Chad");
		const p2 = new Player("Olek");

		expect(p1.name).toBe("Chad");
		expect(p2.name).toBe("Chad");
		expect(p1.name).toBe(p2.name);

		expect(p1).toBe(p2);
	});
});
