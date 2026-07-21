import { totalCalories } from "./calories";
import { describe, it, expect } from "vitest";

describe("totalCalories", () => {
  it("сложение двух положительных", () => {
    const twoPositiveMeals = [{ kcal: 50 }, { kcal: 100 }];
    const total = totalCalories(twoPositiveMeals);
    expect(total).toBe(150);
  });

  it("сложение двух отрицательных", () => {
    const twoNegativeMeals = [{ kcal: -50 }, { kcal: -100 }];
    const total = totalCalories(twoNegativeMeals);
    expect(total).toBe(-150);
  });

  it("сложение отрицательного с положительным", () => {
    const twoPositiveAndNegativeMeals = [{ kcal: 50 }, { kcal: -100 }];
    const total = totalCalories(twoPositiveAndNegativeMeals);
    expect(total).toBe(-50);
  });

  it("сложение одного блюда", () => {
    const oneMeal = [{ kcal: 50 }];
    const total = totalCalories(oneMeal);
    expect(total).toBe(50);
  });

  it("сложение трёх блюд", () => {
    const threeMeals = [{ kcal: 50 }, { kcal: 100 }, { kcal: 150 }];
    const total = totalCalories(threeMeals);
    expect(total).toBe(300);
  });

  it("два блюда с калориями с плавающей точкой", () => {
    const twoFloatMeals = [{ kcal: 0.1 }, { kcal: 0.2 }];
    const total = totalCalories(twoFloatMeals);
    expect(total).toBeCloseTo(0.3);
  });

  it("пустой массив", () => {
    const total = totalCalories([]);
    expect(total).toBe(0);
  });
});
