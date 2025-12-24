/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { describe, expect, test } from "vitest";
import Interceptable from "./interceptable";

describe("[Classes] Interceptable", () => {
	describe("[PASS]", () => {
		describe("[METHOD] add", () => {
			test("Should add multiple interceptors and maintain priority order", () => {
				const interceptable = new Interceptable<number, {}>();
				interceptable.add({ priority: 10, interceptor: v => v + 1 });
				interceptable.add({ priority: 1, interceptor: v => v * 10 });
				interceptable.add(v => v - 5);
				expect(interceptable.getValue(10, {})).toBe(51);
			});
		});

		describe("[METHOD] once", () => {
			test("Once", () => {
				const stats = { hp: 10 };
				const Interceptors = {
					hp: new Interceptable<(typeof stats)["hp"], {}>()
				};
				Interceptors.hp.add(value => value * 2);
				Interceptors.hp.once(value => value * 2);

				expect(Interceptors.hp.getValue(stats.hp, {})).toBe(40);
				expect(Interceptors.hp.getValue(stats.hp, {})).toBe(20);
			});

			test("Multiple once interceptors should work independently", () => {
				const interceptable = new Interceptable<number, {}>();
				interceptable.once(v => v + 1);
				interceptable.once(v => v + 2);

				expect(interceptable.getValue(0, {})).toBe(3);
				expect(interceptable.getValue(0, {})).toBe(0);
			});
		});

		describe("[EXTREME] Edge Cases & Stress Tests", () => {
			test("Should handle huge priority gaps and negative priorities", () => {
				const interceptable = new Interceptable<number, {}>();

				interceptable.add({ priority: 1_000_000, interceptor: v => v / 2 });
				interceptable.add({ priority: -999, interceptor: v => v + 100 });

				expect(interceptable.getValue(10, {})).toBe(55);
			});

			test("Stable Sorting: Should maintain insertion order for same priorities", () => {
				const interceptable = new Interceptable<string, {}>();

				interceptable.add({ priority: 5, interceptor: v => `${v}A` });
				interceptable.add({ priority: 5, interceptor: v => `${v}B` });
				interceptable.add({ priority: 5, interceptor: v => `${v}C` });

				expect(interceptable.getValue("Start", {})).toBe("StartABC");
			});

			test("Should handle empty listener list gracefully", () => {
				const interceptable = new Interceptable<number, {}>();
				// Powinno po prostu zwrócić wartość wejściową
				expect(interceptable.getValue(42, {})).toBe(42);
			});

			test("Recursion: Should handle getValue called inside an interceptor", () => {
				const interceptable = new Interceptable<number, {}>();

				interceptable.add(v => {
					if (v === 1) return v;
					return interceptable.getValue(1, {});
				});

				expect(interceptable.getValue(10, {})).toBe(1);
			});

			test("Error propagation: Should throw if an interceptor crashes", () => {
				const interceptable = new Interceptable<number, {}>();

				interceptable.add(() => {
					throw new Error("Interceptor Failed");
				});

				expect(() => interceptable.getValue(10, {})).toThrow("Interceptor Failed");
			});

			test("Remove non-existent: Should return false when removing missing tag/function", () => {
				const interceptable = new Interceptable<number, {}>();

				expect(interceptable.remove(() => 0)).toBe(false);
				expect(interceptable.removeByTag("non-existent")).toBe(false);
			});

			test("Context mutation protection (Logic Check)", () => {
				const interceptable = new Interceptable<number, { count: number }>();
				const ctx = { count: 0 };

				interceptable.add((v, c) => v + c.count);

				expect(interceptable.getValue(10, ctx)).toBe(10);
			});

			test("Massive Once: Adding and consuming 1000 once-interceptors", () => {
				const interceptable = new Interceptable<number, {}>();
				for (let i = 0; i < 1000; i++) {
					interceptable.once(v => v + 1);
				}

				expect(interceptable.getValue(0, {})).toBe(1000);
				expect(interceptable.getValue(0, {})).toBe(0);
			});
		});
	});
});
