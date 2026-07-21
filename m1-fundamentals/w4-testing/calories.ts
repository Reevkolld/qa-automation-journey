export function totalCalories(meals: { kcal: number }[]): number {
  return meals.reduce((sum, m) => sum + m.kcal, 0);
}
