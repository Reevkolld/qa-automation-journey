import { describe, it, expect } from "vitest";
import { sum } from "./sum.js";
import { makePoint } from "./sum.js";

describe("sum", () => {
  it("складывает положительные", () => expect(sum(2, 3)).toBe(5));
  it("работает с нулём", () => expect(sum(0, 5)).toBe(5));
  it("отрицательные", () => expect(sum(-5, -6)).toBe(-11));
});

describe("makePoint", () => {
  it("toEqual на объекте", () => {
    expect(makePoint(1, 2)).toEqual({ x: 1, y: 2 });
  });
});
