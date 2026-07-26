// 1. Типы (types.ts)
// Meal: { name: string; kcal: number; date: string } (date — YYYY-MM-DD).
// DaySummary: { date: string; meals: Meal[]; total: number }.
// Данные из файла — всегда unknown на входе; сузить/провалидировать перед тем, как назвать их Meal[] (не as Meal[] вслепую — урок W3: посмотреть, что это массив,
// и что у каждого элемента name — строка, kcal — число, date — строка).
// Опционально (по желанию, не обязательно): тип для ввода без даты через Omit<Meal, "date">, чтобы явно показать, что дата — не то, что вводит пользователь напрямую.

export type Meal = { name: string; kcal: number; date: string };

export type DaySummary = { date: string; meals: Meal[]; total: number };

export function isMeal(value: unknown): value is Meal {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.name === "string" && typeof v.kcal === "number" && typeof v.date === "string";
}

export function isMealArray(value: unknown): value is Meal[] {
  return Array.isArray(value) && value.every(isMeal);
}

export type MealInput = Omit<Meal, "date">;
