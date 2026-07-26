import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";
import { type Meal, isMealArray } from "./types";

export function readMeals(filePath: string): Meal[] {
  try {
    const raw = readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!isMealArray(parsed)) {
      return [];
    }
    return parsed;
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") {
      return [];
    }
    if (err instanceof SyntaxError) {
      return [];
    }
    throw err;
  }
}

export function saveMeals(filePath: string, meals: Meal[]): void {
  mkdirSync(dirname(filePath), { recursive: true });
  const saved = JSON.stringify(meals, null, 2);
  writeFileSync(filePath, saved);
}
