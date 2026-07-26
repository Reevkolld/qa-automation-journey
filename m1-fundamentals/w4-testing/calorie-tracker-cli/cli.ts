import { join } from "path";
import { type Meal } from "./types";
import { readMeals, saveMeals } from "./storage";

const dataPath = join(__dirname, "data", "meals.json");

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

// argv[0] — node, argv[1] — путь к этому файлу, дальше — реальные аргументы пользователя
const [, , command, ...rest] = process.argv;

if (command === "add-meal") {
  const [name, kcalRaw, dateRaw] = rest;
  const kcal = Number(kcalRaw);

  if (!name || !Number.isFinite(kcal) || kcal <= 0) {
    console.error("Использование: add-meal <name> <kcal> [date]");
    process.exit(1);
  }

  const date = dateRaw ?? today();
  const meals = readMeals(dataPath);
  const newMeal: Meal = { name, kcal, date };
  saveMeals(dataPath, [...meals, newMeal]);

  console.log(`Добавлено: ${name}, ${kcal} ккал, ${date}`);
} else if (command === "daily-summary") {
  const date = rest[0] ?? today();
  const meals = readMeals(dataPath);
  const mealsForDate = meals.filter((m) => m.date === date);

  if (mealsForDate.length === 0) {
    console.log(`За ${date} записей нет.`);
  } else {
    const total = mealsForDate.reduce((sum, m) => sum + m.kcal, 0);
    console.log(`Сводка за ${date}:`);
    mealsForDate.forEach((m) => console.log(`  ${m.name} — ${m.kcal} ккал`));
    console.log(`Итого: ${total} ккал`);
  }
} else {
  console.error(`Неизвестная команда: ${command}. Доступно: add-meal, daily-summary`);
  process.exit(1);
}

