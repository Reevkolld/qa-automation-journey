// =============================================================
// 02 — Type coercion: == vs ===, truthy/falsy
// Запуск: node 02-coercion.js
//
// Идея: сначала ПРЕДСКАЖИ результат каждой строки (в уме или в
// комментарии), потом запусти и сверь с таблицей в консоли.
// =============================================================

// Печатает значение читаемо: строки в кавычках, массивы как [..], и т.д.
function fmt(v) {
  if (typeof v === "string") return `'${v}'`;
  if (Array.isArray(v)) return `[${v.map(fmt).join(", ")}]`;
  if (v === null) return "null";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v); // number, boolean, undefined, NaN
}

function pad(s, n) {
  return String(s).padEnd(n);
}

// -------------------------------------------------------------
// Задача 1 + 2. Каждая пара — сразу через == и через ===
// Колонки: ЛЕВОЕ | ПРАВОЕ | результат == | результат ===
// -------------------------------------------------------------
const pairs = [
  { a: 0,    b: "" },
  { a: 0,    b: false },
  { a: "",   b: false },
  { a: null, b: undefined },
  { a: null, b: 0 },
  { a: "0",  b: false },
  { a: [],   b: false },
  { a: [],   b: ![], bStr: "![]  (→ false)" }, // самый коварный
  { a: NaN,  b: NaN },
  { a: "1",  b: 1 },
];

console.log("\n=== Задача 1+2: == vs === ===\n");
console.log(pad("ЛЕВОЕ", 12) + pad("ПРАВОЕ", 18) + pad("==", 9) + "===");
console.log("-".repeat(45));
for (const p of pairs) {
  const aStr = p.aStr ?? fmt(p.a);
  const bStr = p.bStr ?? fmt(p.b);
  const looseEq = p.a == p.b;   // нестрогое (с приведением типов)
  const strictEq = p.a === p.b; // строгое (без приведения)
  console.log(pad(aStr, 12) + pad(bStr, 18) + pad(looseEq, 9) + strictEq);
}
console.log("\nВывод: где == и === расходятся — там сработало приведение типов.\n");

// -------------------------------------------------------------
// Задача 3. Truthy / falsy
// В JS ровно 8 falsy-значений. Предскажи их ДО запуска: ___
// -------------------------------------------------------------
const values = [0, -0, "", "0", null, undefined, NaN, [], {}, "false"];

console.log("=== Задача 3: truthy / falsy ===\n");
console.log(pad("ЗНАЧЕНИЕ", 14) + pad("Boolean()", 11) + "тип");
console.log("-".repeat(38));
for (const v of values) {
  const label = Boolean(v) ? "truthy" : "FALSY";
  console.log(pad(fmt(v), 14) + pad(Boolean(v), 11) + label);
}
console.log("\nВопрос: почему '0', [] и {} — truthy, а 0 и '' — falsy? ___\n");

// -------------------------------------------------------------
// Задача 4 (QA-кейс). Опасность truthy-проверок
// `if (!input)` считает "пустым" не только "", но и 0 и NaN.
// Ниже видно баг наглядно.
// -------------------------------------------------------------
function describeBuggy(input) {
  if (!input) return "пусто";
  return "есть значение: " + fmt(input);
}

// Безопасный вариант: проверяем именно отсутствие значения
function describeFixed(input) {
  if (input === null || input === undefined || input === "") return "пусто";
  return "есть значение: " + fmt(input);
}

console.log("=== Задача 4: truthy-проверка прячет баг ===\n");
for (const input of ["", "0", 0, null, "hello"]) {
  console.log(
    pad(fmt(input), 10) +
      "buggy → " + pad(describeBuggy(input), 28) +
      "fixed → " + describeFixed(input)
  );
}

// -------------------------------------------------------------
// ВЫВОД (впиши после прогона):
// 8 falsy-значений: ___
// Почему в ассертах/проверках опасно полагаться на == и на !value: ___
// -------------------------------------------------------------
