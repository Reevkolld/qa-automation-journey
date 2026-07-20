// =============================================================
// 03 — Обработка ошибок: try/catch вокруг await, Promise.all vs
// Promise.allSettled, race condition

// Общая "заготовка" задачи: имитация асинхронной операции, которая
// может либо resolve через ms миллисекунд, либо reject с ошибкой.
function task(id, ms, shouldFail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error(`task ${id} failed`));
      else resolve(`task ${id} done`);
    }, ms);
  });
}

// -------------------------------------------------------------
// Задача 1. Одна ошибка — try/catch вокруг await (recap со вторника/среды)
// TODO: напиши async-функцию runOne(), которая await'ит task(1, 100, true)
// (заведомо падающий) внутри try/catch и печатает результат/ошибку.
// -------------------------------------------------------------
async function runOne() {
  try {
    const result = await task(1, 100, true);
    console.log(result);
  } catch (error) {
    console.log("RunOne error: ", error.message);
  }
}

runOne();

// -------------------------------------------------------------
// Задача 2. Promise.all — ошибка в одном из нескольких параллельных
// Три задачи: task(1, 100, false), task(2, 50, true), task(3, 150, false).
// TODO: напиши async-функцию runAll(), которая await'ит Promise.all(...)
// с этими тремя задачами внутри try/catch.
// ПРЕДСКАЗАНИЕ перед запуском: какую ошибку ты увидишь в catch — и через
// сколько мс примерно (вспомни: fail-fast, самая быстрая ошибка "побеждает")?
// -------------------------------------------------------------
async function runAll() {
  try {
    const result = await Promise.all([task(1, 100, false), task(2, 50, true), task(3, 150, false)]);
    console.log(result);
  } catch (error) {
    console.log("RunAll error: ", error.message);
  }
}

runAll();

// -------------------------------------------------------------
// Задача 3. Promise.allSettled — тот же набор задач, но без потери
// результатов остальных двух.
// TODO: напиши async-функцию runAllSettled() с теми же тремя task(...),
// но через Promise.allSettled. Раздели результат на fulfilled/rejected
// (results.filter(...)) и выведи количество тех и других в консоль.
// -------------------------------------------------------------
async function runAllSettled() {
  try {
    const results = await Promise.allSettled([
      task(1, 100, false),
      task(2, 50, true),
      task(3, 150, false),
    ]);
    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected");
    console.log(`Fulfilled: ${fulfilled.length}, Rejected: ${rejected.length}`);
    console.log("Results:", results);
  } catch (error) {
    console.log("RunAllSettled error: ", error.message);
  }
}

runAllSettled();

// -------------------------------------------------------------
// Задача 4 (QA-кейс). Race condition — непредсказуемый порядок записи
// в общее состояние. sharedState обновляется двумя параллельными
// "записями" со случайной задержкой — какая победит, заранее неизвестно.
// TODO:
//   1) напиши writeState(value, delayMs), которая через setTimeout(delayMs)
//      устанавливает sharedState = value и resolve() (без аргумента);
//   2) напиши async-функцию demoRace(), которая через Promise.all
//      параллельно запускает writeState("from A", случайная задержка 0-100мс)
//      и writeState("from B", случайная задержка 0-100мс), затем печатает
//      итоговое значение sharedState.
// Запусти demoRace() несколько раз подряд (см. runDemoRaceMultipleTimes
// ниже) — значение должно "прыгать" между "from A" и "from B".
// -------------------------------------------------------------
let sharedState = "initial";

function writeState(value, delayMs) {
  return new Promise((resolve) => {
    setTimeout(() => {
      sharedState = value;
      resolve();
    }, delayMs);
  });
}

async function demoRace() {
  try {
    await Promise.all([
      writeState("from A", Math.floor(Math.random() * 100)),
      writeState("from B", Math.floor(Math.random() * 100)),
    ]);
    console.log("Final sharedState:", sharedState);
  } catch (error) {
    console.log("RunDemoRace error: ", error.message);
  }
}

async function runDemoRaceMultipleTimes() {
  for (let i = 0; i < 5; i++) {
    sharedState = "initial";
    await demoRace();
  }
}

runDemoRaceMultipleTimes();

// -------------------------------------------------------------
// ВЫВОД: своими словами —
// (а) почему Promise.all показал только ОДНУ ошибку, даже если бы упали
//     все три задачи?
//
// После первого reject'а остальные задачи продолжали выполняться, но их ошибки игнорировались

// (б) почему race condition в задаче 4 нельзя "починить" через
//     Promise.allSettled — в чём разница между проблемой параллельных
//     ошибок и проблемой непредсказуемого порядка записи в общее состояние?
//  allSettled позволяет получить все результаты, но не гарантирует порядок выполнения. В случае race condition, обе записи могут
// завершиться в любом порядке, и последняя запись перезапишет предыдущую, что приводит к непредсказуемому состоянию sharedState, например,
// если writeState("from A") завершится после writeState("from B"), то sharedState будет "from A", и наоборот
// -------------------------------------------------------------

// =============================================================
// Задача 5 (10.07). Последовательный await vs Promise.all — время выполнения
// Три задачи по 100мс каждая, все успешные (shouldFail = false).
// TODO:
//   1) напиши runSequential() — async-функция, которая в for-цикле по
//      [1, 2, 3] делает await task(id, 100, false) один за другим;
//      измерь время через console.time("sequential") / console.timeEnd(...);
//   2) напиши runParallel() — async-функция, которая через Promise.all
//      запускает те же три task(id, 100, false) одновременно
//      ([1, 2, 3].map(id => task(id, 100, false))); измерь время так же.
// ПРЕДСКАЗАНИЕ перед запуском: sequential ~300мс, parallel ~100мс — почему
// именно такая разница (сумма vs максимум)?
// -------------------------------------------------------------
async function runSequential() {
  try {
    console.time("sequential");
    for (const id of [1, 2, 3]) {
      const result = await task(id, 100, false);
      console.log(result);
    }
    console.timeEnd("sequential");
  } catch (error) {
    console.log("RunSequential error: ", error.message);
  }
}

async function runParallel() {
  try {
    console.time("parallel");
    const results = await Promise.all([1, 2, 3].map((id) => task(id, 100, false)));
    console.log(results);
    console.timeEnd("parallel");
  } catch (error) {
    console.log("RunParallel error: ", error.message);
  }
}

runSequential();
runParallel();

// -------------------------------------------------------------
// ВЫВОД (задача 5): своими словами — совпало ли реальное время с
// предсказанием? Когда в реальном Playwright-тесте ты бы намеренно выбрал
// последовательные await вместо Promise.all, даже зная, что это медленнее?
// Когда один тест зависит от результата предыдущего (например, нужно сначала залогиниться, а потом делать действия в приложении),
// тогда последовательные await оправданы. В остальных случаях лучше использовать Promise.all для параллельного выполнения задач,
// чтобы сократить общее время выполнения
// -------------------------------------------------------------
