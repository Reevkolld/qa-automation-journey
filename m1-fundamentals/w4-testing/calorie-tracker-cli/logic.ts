import { type Meal, type DaySummary } from "./types";

export function validateMeal(input: { name: string; kcal: number }): boolean {
  if (input.kcal <= 0 || !Number.isFinite(input.kcal) || input.name.trim() === "") return false;

  return true;
}

export function addMeal(meals: Meal[], meal: Meal): Meal[] {
  if (!validateMeal(meal)) throw new Error("Invalid meal");

  return [...meals, meal];
}

export function summarize(meals: Meal[], date: string): DaySummary {
  const mealsForDate = meals.filter((m) => m.date === date);
  const total = mealsForDate.reduce((sum, m) => sum + m.kcal, 0);

  return { date, meals: mealsForDate, total };
}
