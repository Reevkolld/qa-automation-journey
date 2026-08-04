import { describe, it, expect } from "vitest";
import { addMeal, validateMeal, summarize } from "./logic";
import type { Meal } from "./types";

describe("validateMeal", () => {
  it("валидный meal", () => {
    const meal = { name: "Test Meal", kcal: 100 };
    const isValid = validateMeal(meal);
    expect(isValid).toBe(true);
  });

  it("некорректные калории (<= 0)", () => {
    const meal = { name: "Test Meal", kcal: 0 };
    const isValid = validateMeal(meal);
    expect(isValid).toBe(false);
  });

  it("некорректные калории (NaN)", () => {
    const meal = { name: "Test Meal", kcal: NaN };
    const isValid = validateMeal(meal);
    expect(isValid).toBe(false);
  });

  it("некорректное имя (пустая строка)", () => {
    const meal = { name: "", kcal: 100 };
    const isValid = validateMeal(meal);
    expect(isValid).toBe(false);
  });

  it("некорректное имя (только пробелы)", () => {
    const meal = { name: "   ", kcal: 100 };
    const isValid = validateMeal(meal);
    expect(isValid).toBe(false);
  });
});

describe("addMeal", () => {
  it("добавление в пустой список", () => {
    const meals: Meal[] = [];
    const newMeal: Meal = { name: "Test Meal", kcal: 100, date: "2024-06-01" };
    const updatedMeals = addMeal(meals, newMeal);
    expect(updatedMeals).toHaveLength(1);
    expect(updatedMeals[0]).toEqual(newMeal);
  });

  it("добавление в непустой список", () => {
    const meals: Meal[] = [{ name: "Existing Meal", kcal: 50, date: "2024-06-01" }];
    const newMeal: Meal = { name: "Test Meal", kcal: 100, date: "2024-06-01" };
    const updatedMeals = addMeal(meals, newMeal);
    expect(updatedMeals).toHaveLength(2);
    expect(updatedMeals[1]).toEqual(newMeal);
  });

  it("не мутирует входной массив", () => {
    const meals: Meal[] = [{ name: "Existing Meal", kcal: 50, date: "2024-06-01" }];
    const newMeal: Meal = { name: "Test Meal", kcal: 100, date: "2024-06-01" };
    const updatedMeals = addMeal(meals, newMeal);
    expect(meals).toHaveLength(1);
    expect(updatedMeals).not.toBe(meals);
  });

  it("добавление с отрицательными калориями", () => {
    const meals: Meal[] = [];
    const newMeal: Meal = { name: "Test Meal", kcal: -100, date: "2024-06-01" };
    expect(() => addMeal(meals, newMeal)).toThrow("Invalid meal");
  });

  it("добавление с NaN калориями", () => {
    const meals: Meal[] = [];
    const newMeal: Meal = { name: "Test Meal", kcal: NaN, date: "2024-06-01" };
    expect(() => addMeal(meals, newMeal)).toThrow("Invalid meal");
  });
});

describe("summarize", () => {
  it("сводка по дате с приёмами пищи", () => {
    const meals: Meal[] = [
      { name: "Meal 1", kcal: 100, date: "2024-06-01" },
      { name: "Meal 2", kcal: 200, date: "2024-06-01" },
      { name: "Meal 3", kcal: 150, date: "2024-06-02" },
    ];
    const summary = summarize(meals, "2024-06-01");
    expect(summary.date).toBe("2024-06-01");
    expect(summary.meals).toHaveLength(2);
    expect(summary.total).toBe(300);
  });

  it("сводка по дате без приёмов пищи", () => {
    const meals: Meal[] = [
      { name: "Meal 1", kcal: 100, date: "2024-06-01" },
      { name: "Meal 2", kcal: 200, date: "2024-06-01" },
      { name: "Meal 3", kcal: 150, date: "2024-06-02" },
    ];
    const summary = summarize(meals, "2024-06-03");
    expect(summary.date).toBe("2024-06-03");
    expect(summary.meals).toHaveLength(0);
    expect(summary.total).toBe(0);
  });

  it("сводка по дате с одним приёмом пищи", () => {
    const meals: Meal[] = [
      { name: "Meal 1", kcal: 100, date: "2024-06-01" },
      { name: "Meal 2", kcal: 200, date: "2024-06-01" },
      { name: "Meal 3", kcal: 150, date: "2024-06-02" },
    ];
    const summary = summarize(meals, "2024-06-02");
    expect(summary.date).toBe("2024-06-02");
    expect(summary.meals).toHaveLength(1);
    expect(summary.total).toBe(150);
  });
});
