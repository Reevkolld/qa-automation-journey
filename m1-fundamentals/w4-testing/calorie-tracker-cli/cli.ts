import { join } from "path";
import { type Meal } from "./types";
import { readMeals, saveMeals } from "./storage";
import { addMeal, summarize } from "./logic";

const dataPath = join(__dirname, "data", "meals.json");

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

const [, , command, ...rest] = process.argv;

if (command === "add-meal") {
  const [name, kcalRaw, dateRaw] = rest;
  const meal: Meal = { name: name ?? "", kcal: Number(kcalRaw), date: dateRaw ?? today() };

  try {
    saveMeals(dataPath, addMeal(readMeals(dataPath), meal));
    console.log(`Добавлено: ${meal.name}, ${meal.kcal} ккал, ${meal.date}`);
  } catch (err) {
    // Ловим только ошибку валидации. Ошибки файловой системы не глушим — они должны быть видны.
    if (err instanceof Error && err.message === "Invalid meal") {
      console.error("Использование: add-meal <name> <kcal> [date], где kcal — число больше 0");
      process.exit(1);
    }
    throw err;
  }
} else if (command === "daily-summary") {
  const date = rest[0] ?? today();
  const summary = summarize(readMeals(dataPath), date);

  if (summary.meals.length === 0) {
    console.log(`За ${date} записей нет.`);
  } else {
    console.log(`Сводка за ${date}:`);
    summary.meals.forEach((m) => console.log(`  ${m.name} — ${m.kcal} ккал`));
    console.log(`Итого: ${summary.total} ккал`);
  }
} else {
  console.error(`Неизвестная команда: ${command}. Доступно: add-meal, daily-summary`);
  process.exit(1);
}
