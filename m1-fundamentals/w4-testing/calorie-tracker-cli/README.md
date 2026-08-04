# calorie-tracker-cli

CLI-дневник питания на TypeScript: добавляет приёмы пищи в JSON-файл и считает суточную сводку по калориям. Учебный проект — финальный артефакт месяца M1 (типы, чистые функции, vitest).

## Установка

```bash
npm install        # из корня репозитория
```

## Команды

```bash
npx tsx m1-fundamentals/w4-testing/calorie-tracker-cli/cli.ts add-meal "Овсянка" 350
npx tsx m1-fundamentals/w4-testing/calorie-tracker-cli/cli.ts add-meal "Кофе" 90 2026-08-04
npx tsx m1-fundamentals/w4-testing/calorie-tracker-cli/cli.ts daily-summary
npx tsx m1-fundamentals/w4-testing/calorie-tracker-cli/cli.ts daily-summary 2026-08-04
```

`date` — опционально, формат `YYYY-MM-DD`, по умолчанию сегодня. `kcal` — число больше нуля, иначе команда падает с подсказкой и кодом выхода 1.

Пример вывода:

```
Добавлено: Овсянка, 350 ккал, 2026-08-04

Сводка за 2026-08-04:
  Овсянка — 350 ккал
  Кофе — 90 ккал
Итого: 440 ккал
```

## Где данные

`m1-fundamentals/w4-testing/calorie-tracker-cli/data/meals.json` — создаётся автоматически при первом `add-meal`. Битый или отсутствующий файл читается как пустой список, а не роняет приложение.

## Тесты и качество кода

```bash
npm run test       # vitest — юнит-тесты чистых функций из logic.ts
npm run lint       # eslint
npm run format     # prettier --write
```

## Структура

- `types.ts` — `Meal`, `DaySummary` + type guards для данных из файла
- `storage.ts` — чтение/запись JSON (I/O)
- `logic.ts` — `validateMeal`, `addMeal`, `summarize` — чистые функции, их и покрывают тесты
- `cli.ts` — разбор `argv`, вывод в консоль; вся бизнес-логика вызывается из `logic.ts`, не дублируется
