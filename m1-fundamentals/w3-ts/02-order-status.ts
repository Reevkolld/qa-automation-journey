// Смоделируй статус заказа, у которого возможны ровно четыре значения: new, paid, shipped, done.

// Требования:

// Функция nextStatus(current) возвращает следующий по порядку статус, а для done — снова done.
// Передать значение вне набора (например "cancelled") должно быть ошибкой компиляции, а не рантайма.
// Ни одной «магической строки» в теле, которую компилятор не проверяет.
// Проверь переходы по всей цепочке new → paid → shipped → done → done.

// Каким средством TS зафиксировать «ровно эти четыре значения» — решай сам. Здесь есть как минимум два разумных варианта; выбери один и в разделе ниже объясни, почему именно он.

type OrderStatus = "new" | "paid" | "shipped" | "done"; // Я выбрал строковый литеральный тип, потому что он позволяет явно указать все допустимые значения статуса заказа.
// Это обеспечивает строгую проверку типов на этапе компиляции, предотвращая использование недопустимых значений. Кроме того, такой подход делает
//  код более читаемым и понятным, так как все возможные статусы видны в одном месте.

function nextStatus(current: OrderStatus): OrderStatus {
  switch (current) {
    case "new":
      return "paid";
    case "paid":
      return "shipped";
    case "shipped":
      return "done";
    case "done":
      return "done";
    default: {
      const _exhaustive: never = current;
      return _exhaustive;
    }
  }
}

function main(): void {
  const statuses: OrderStatus[] = ["new", "paid", "shipped", "done"];
  let currentStatus: OrderStatus = "new";
  let newStatus: OrderStatus;
  for (let i = 0; i < statuses.length; i++) {
    newStatus = nextStatus(currentStatus);
    console.log(`Current status: ${currentStatus}, Next status: ${newStatus}`);
    currentStatus = newStatus;
  }
}
main();
