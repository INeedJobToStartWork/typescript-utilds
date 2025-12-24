/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { describe, expect, test } from "vitest";
import { Interceptable } from "@/classes";
import { createInterceptedObject } from "@/functions";

describe("[Function] createInterceptedObject", () => {
	describe("[PASS]", () => {
		test.only("Example", () => {
			const stats = {
				hp: 10
			};
			const Interceptors = {
				hp: new Interceptable<(typeof stats)["hp"], typeof stats>()
			};

			const Proxy = createInterceptedObject(stats, Interceptors);

			Interceptors.hp.add(value => value * 2);
			Interceptors.hp.once(value => value * 2);

			expect(Proxy.hp).toBe(40);
			expect(Proxy.hp).toBe(20);
		});
	});
});
