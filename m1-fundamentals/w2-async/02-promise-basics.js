// =============================================================
// 02 — Промисы: перепиши callback-функции в промисы (часть 1 из 2)
// Запуск: node m1-fundamentals/w2-async/02-promise-basics.js
// async/await-версия этих же функций — завтра (03-async-await.js)

// -------------------------------------------------------------
// Задача 1. delay — колбэк-версия таймера
// TODO: напиши delayPromise(ms), которая возвращает Promise,
// resolve() которого происходит через ms миллисекунд.
// -------------------------------------------------------------
function delayCallback(ms, callback) {
  setTimeout(() => callback(), ms);
}

delayCallback(300, () => console.log("1 (callback): прошло 300мс"));

function delayPromise(ms) {
  // TODO: return new Promise(...)
}

// delayPromise(300).then(() => console.log("1 (promise): прошло 300мс"));


// -------------------------------------------------------------
// Задача 2. Error-first callback (стандартный Node-паттерн) → промис
// Симулирует поиск пользователя по id. Если id <= 0 — ошибка.
// TODO: напиши getUserPromise(id), возвращающую Promise, которая
// resolve(user) при успехе и reject(error) при ошибке.
// -------------------------------------------------------------
function getUserCallback(id, callback) {
  setTimeout(() => {
    if (id <= 0) {
      callback(new Error(`Invalid id: ${id}`));
      return;
    }
    callback(null, { id, name: `User#${id}` });
  }, 200);
}

getUserCallback(1, (err, user) => {
  if (err) return console.log("2 (callback) error:", err.message);
  console.log("2 (callback) success:", user);
});

function getUserPromise(id) {
  // TODO: return new Promise((resolve, reject) => { ... используй getUserCallback внутри ... })
}

// getUserPromise(1).then(user => console.log("2 (promise) success:", user));
// getUserPromise(-1).catch(err => console.log("2 (promise) error:", err.message));


// -------------------------------------------------------------
// Задача 3. Асинхронная валидация с ошибкой
// TODO: напиши divide Promise-версию: divideAsync(a, b) — reject,
// если b === 0, иначе resolve(a / b). Задержка — 100мс (setTimeout).
// -------------------------------------------------------------
function divideCallback(a, b, callback) {
  setTimeout(() => {
    if (b === 0) {
      callback(new Error("Division by zero"));
      return;
    }
    callback(null, a / b);
  }, 100);
}

divideCallback(10, 2, (err, result) => {
  if (err) return console.log("3 (callback) error:", err.message);
  console.log("3 (callback) result:", result);
});

function divideAsync(a, b) {
  // TODO
}


// -------------------------------------------------------------
// Задача 4. Callback hell → цепочка промисов
// Три последовательных шага: получить пользователя → получить его посты →
// получить комментарии к первому посту. Каждый шаг зависит от предыдущего.
// TODO: перепиши весь пайплайн через .then().then().then(), используя
// getUserPromise/getPostsPromise/getCommentsPromise (или свои промис-обёртки).
// Не забудь return внутри каждого .then (см. конспект — частая ошибка).
// -------------------------------------------------------------
function getPostsCallback(userId, callback) {
  setTimeout(() => callback(null, [`post-1-of-${userId}`, `post-2-of-${userId}`]), 150);
}

function getCommentsCallback(postId, callback) {
  setTimeout(() => callback(null, [`comment-1-on-${postId}`, `comment-2-on-${postId}`]), 150);
}

// Callback hell — вот от чего мы уходим:
getUserCallback(1, (err, user) => {
  if (err) return console.log("4 (callback) error:", err.message);
  getPostsCallback(user.id, (err, posts) => {
    if (err) return console.log("4 (callback) error:", err.message);
    getCommentsCallback(posts[0], (err, comments) => {
      if (err) return console.log("4 (callback) error:", err.message);
      console.log("4 (callback) comments:", comments);
    });
  });
});

function getPostsPromise(userId) {
  // TODO
}

function getCommentsPromise(postId) {
  // TODO
}

// TODO: собери цепочку — getUserPromise(1).then(...).then(...).then(comments => console.log("4 (promise) comments:", comments));


// -------------------------------------------------------------
// Задача 5 (QA-кейс). Retry-обёртка над "флаки" операцией
// checkElementCallback имитирует нестабильную проверку в тесте: с 50%
// шансом падает первый раз, но проходит при повторе — классика flaky UI.
// TODO: напиши checkElementWithRetry() — Promise-версия, которая:
//   1) пробует checkElementCallback один раз;
//   2) если ошибка — пробует ЕЩЁ РАЗ (ровно один retry);
//   3) если второй раз тоже ошибка — reject с этой ошибкой.
// Подсказка: .catch() в цепочке может вернуть новый вызов той же функции.
// -------------------------------------------------------------
function checkElementCallback(callback) {
  const willFail = Math.random() < 0.5;
  setTimeout(() => {
    if (willFail) {
      callback(new Error("Element not visible yet"));
      return;
    }
    callback(null, "Element is visible");
  }, 100);
}

function checkElementCallbackPromise() {
  // TODO: обёртка checkElementCallback в Promise (без retry — это шаг 1)
}

function checkElementWithRetry() {
  // TODO: используй checkElementCallbackPromise() + .catch(() => checkElementCallbackPromise())
}

// checkElementWithRetry()
//   .then(result => console.log("5 (promise) success:", result))
//   .catch(err => console.log("5 (promise) failed after retry:", err.message));


// -------------------------------------------------------------
// ВЫВОД: своими словами — почему error-first callback (err, data) =>
// удобно оборачивать именно как reject(err)/resolve(data), а не наоборот?
//
// -------------------------------------------------------------
