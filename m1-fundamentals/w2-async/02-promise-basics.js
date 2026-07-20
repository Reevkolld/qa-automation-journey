// =============================================================
// 02 — Промисы: перепиши callback-функции в промисы (часть 1 из 2)

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
  return new Promise((resolve) => setTimeout(resolve, ms));
}

delayPromise(300).then(() => console.log("1 (promise): прошло 300мс"));

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
  return new Promise((resolve, reject) => {
    getUserCallback(id, (err, user) => {
      if (err) reject(err);
      else resolve(user);
    });
  });
}

getUserPromise(1).then((user) => console.log("2 (promise) success:", user));
getUserPromise(-1).catch((err) => console.log("2 (promise) error:", err.message));

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
  return new Promise((resolve, reject) => {
    divideCallback(a, b, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

divideAsync(10, 2).then((result) => console.log("3 (promise) result:", result));
divideAsync(10, 0).catch((err) => console.log("3 (promise) error:", err.message));
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
  return new Promise((resolve, reject) => {
    getPostsCallback(userId, (err, posts) => {
      if (err) reject(err);
      else resolve(posts);
    });
  });
}

function getCommentsPromise(postId) {
  return new Promise((resolve, reject) => {
    getCommentsCallback(postId, (err, comments) => {
      if (err) reject(err);
      else resolve(comments);
    });
  });
}

// TODO: собери цепочку — getUserPromise(1).then(...).then(...).then(comments => console.log("4 (promise) comments:", comments));
getUserPromise(1)
  .then((user) => {
    return getPostsPromise(user.id);
  })
  .then((posts) => {
    return getCommentsPromise(posts[0]);
  })
  .then((comments) => {
    console.log("4 (promise) comments:", comments);
  })
  .catch((err) => {
    console.log("4 (promise) error:", err.message);
  });

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
  return new Promise((resolve, reject) => {
    checkElementCallback((err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function checkElementWithRetry() {
  // TODO: используй checkElementCallbackPromise() + .catch(() => checkElementCallbackPromise())
  return checkElementCallbackPromise().catch(() => {
    return checkElementCallbackPromise();
  });
}

checkElementWithRetry()
  .then((result) => console.log("5 (promise) success:", result))
  .catch((err) => console.log("5 (promise) failed after retry:", err.message));

// -------------------------------------------------------------
// ВЫВОД: своими словами — почему error-first callback (err, data) =>
// удобно оборачивать именно как reject(err)/resolve(data), а не наоборот?
// Потому что в промисах принято, что reject() сигнализирует об ошибке, а resolve() — об успешном результате.
// Это делает код более читаемым и предсказуемым, так как разработчики ожидают, что ошибки будут обрабатываться через .catch(), а успешные результаты через .then().
// -------------------------------------------------------------

// =============================================================
// ЧАСТЬ 2 — те же 5 функций, теперь через async/await
// Промис-версии выше (delayPromise, getUserPromise, divideAsync,
// getPostsPromise/getCommentsPromise, checkElementCallbackPromise)
// НЕ переписываются — async/await разворачивает ИХ ЖЕ промисы,
// это просто другой синтаксис поверх той же машинерии.
// =============================================================

// -------------------------------------------------------------
// Задача 1 (async/await). Обёртка над delayPromise.
// TODO: напиши async-функцию delayAwait(ms), которая через await
// дожидается delayPromise(ms) и печатает "1 (async/await): прошло Xмс".
// -------------------------------------------------------------
async function delayAwait(ms) {
  await delayPromise(ms);
  console.log(`1 (async/await): прошло ${ms}мс`);
}

delayAwait(300);

// -------------------------------------------------------------
// Задача 2 (async/await). Обёртка над getUserPromise с try/catch.
// TODO: напиши async-функцию getUserAwait(id) — await getUserPromise(id)
// внутри try/catch, лог успеха/ошибки как в promise-версии.
// -------------------------------------------------------------
async function getUserAwait(id) {
  try {
    const user = await getUserPromise(id);
    console.log(`2 (async/await): пользователь найден: ${user.name}`);
  } catch (err) {
    console.log(`2 (async/await): ошибка при получении пользователя: ${err.message}`);
  }
}

getUserAwait(1);
getUserAwait(-1);

// -------------------------------------------------------------
// Задача 3 (async/await). Обёртка над divideAsync с try/catch.
// TODO: напиши async-функцию divideAwait(a, b) по тому же принципу.
// -------------------------------------------------------------
async function divideAwait(a, b) {
  try {
    const result = await divideAsync(a, b);
    console.log(`3 (async/await): результат деления: ${result}`);
  } catch (err) {
    console.log(`3 (async/await): ошибка при делении: ${err.message}`);
  }
}

divideAwait(10, 2);
divideAwait(10, 0);

// -------------------------------------------------------------
// Задача 4 (async/await). Тот же пайплайн user → posts → comments,
// но без .then().then().then() — последовательные await должны
// читаться как обычный синхронный код сверху вниз.
// TODO: напиши async-функцию getFirstPostCommentsAwait(userId),
// которая последовательно await'ит getUserPromise → getPostsPromise →
// getCommentsPromise(posts[0]), с try/catch вокруг всего пайплайна.
// -------------------------------------------------------------
async function getFirstPostCommentsAwait(userId) {
  try {
    const user = await getUserPromise(userId);
    const posts = await getPostsPromise(user.id);
    const comments = await getCommentsPromise(posts[0]);
    console.log(`4 (async/await): комментарии к первому посту: ${comments}`);
  } catch (err) {
    console.log(`4 (async/await): ошибка при получении комментариев: ${err.message}`);
  }
}

getFirstPostCommentsAwait(1);

// -------------------------------------------------------------
// Задача 5 (async/await, QA-кейс). Retry через await + try/catch —
// сравни с версией через .catch() выше: логика та же (одна попытка,
// при ошибке — ровно один повтор), но читается как обычный
// "если не вышло — попробуй ещё раз".
// TODO: напиши async-функцию checkElementWithRetryAwait() —
// первая попытка в try, при ошибке — вторая попытка во вложенном
// try/catch; если и она упадёт — throw дальше.
// -------------------------------------------------------------
async function checkElementWithRetryAwait() {
  try {
    const result = await checkElementCallbackPromise();
    return result;
  } catch (err) {
    console.log("5 (async/await): первая попытка не удалась, пробуем ещё раз...", err.message);
    try {
      const result = await checkElementCallbackPromise();
      return result;
    } catch (err) {
      return Promise.reject(
        new Error("5 (async/await): вторая попытка тоже не удалась: " + err.message),
      );
    }
  }
}

(async () => {
  try {
    const result = await checkElementWithRetryAwait();
    console.log("5 (async/await) success:", result);
  } catch (err) {
    console.log("5 (async/await) failed after retry:", err.message);
  }
})();

// -------------------------------------------------------------
// ВЫВОД: своими словами — что изменилось в читаемости кода между
// .then()-цепочками (часть 1) и async/await (часть 2)? Что осталось
// ровно тем же самым "под капотом"?
// Async/await делает код более линейным и читаемым, так как он выглядит как обычный синхронный код, что упрощает понимание последовательности операций.
// В то время как .then()-цепочки могут быть сложными для восприятия, особенно при наличии нескольких уровней вложенности
// -------------------------------------------------------------
