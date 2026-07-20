// Две небольшие задачи в одном файле.

// Часть 1 — Record. Опиши тип FeatureFlags — словарь с фиксированными ключами "darkMode" | "beta" | "ads" и булевыми значениями. Создай объект flags этого типа.
// Напиши isEnabled(flags, key), возвращающую boolean (ключ должен быть только из допустимых — компилятор проверяет).

// Часть 2 — ReturnType. Есть функция:

// function makeSession() {
//   return { token: "abc", expiresIn: 3600 };
// }
// Получи тип Session из этой функции (не описывая руками) и напиши logSession(s: Session): void.

// Требования:

// FeatureFlags — через Record; Session — через ReturnType (+ typeof).
// Без any. Несуществующий флаг или лишний ключ — ошибка компиляции.
// Проверь: вызови isEnabled(flags, "beta") и logSession(makeSession()).

// Какими utility types это собрать — реши сам (конспект: Record, ReturnType).

type FeatureFlags = Record<"darkMode" | "beta" | "ads", boolean>;

const flags: FeatureFlags = {
  darkMode: true,
  beta: false,
  ads: true,
};

function isEnabled(flags: FeatureFlags, key: keyof FeatureFlags): boolean {
  return flags[key];
}

function makeSession() {
  return { token: "abc", expiresIn: 3600 };
}

type Session = ReturnType<typeof makeSession>;

function logSession(s: Session): void {
  console.log("Session:", s);
}

function main(): void {
  console.log(isEnabled(flags, "beta"));
  logSession(makeSession());
}

main();
