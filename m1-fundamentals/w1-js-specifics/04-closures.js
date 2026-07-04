// =============================================================
// 04 — Замыкания (closures)
// Запуск: node 04-closures.js


// Задача 1. Классический баг: var в цикле с setTimeout
// ПРЕДСКАЗАНИЕ: что выведет первый цикл? 3 3 3 второй? 0 1 2
// -------------------------------------------------------------
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var i:", i)); // 3 3 3 потому что var функциональный, и отображается последнее значение i после завершения цикла
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let j:", j)); // 0 1 2 потому что let блочный, и каждый колбэк захватывает своё значение j в момент создания
}


// Задача 2. Счётчик на замыкании
function makeCounter() {
  let count = 0;
  return function() {
    count += 1;
    return count;
  };
}
const counter = makeCounter();
console.log("2:", counter(), counter(), counter()); // ждём 1 2 3


// Задача 3. Приватное состояние (аналог private поля в C#)
function createWallet(initial) {

  let balance = initial;
  function deposit(amount) { balance += amount; }
  function getBalance() { return balance; }
  return { deposit, getBalance};
}
const w = createWallet(100);
w.deposit(50);
console.log("3:", w.getBalance()); // 150
console.log("balance напрямую доступен?", w.balance); // должно быть undefined

// -------------------------------------------------------------
// ВЫВОД: своими словами — что такое замыкание? Доступ только внутри функции к переменным. Аналогия с C# делегатами - захват переменных.
// -------------------------------------------------------------
