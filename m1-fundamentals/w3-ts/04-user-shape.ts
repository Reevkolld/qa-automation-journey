// Опиши базовую сущность User с полями id: number и name: string. Затем сделай Admin, у которого дополнительно есть поле role со строго значением "admin" (не любая строка). Напиши функцию describe(u: User): string, возвращающую строку вида "#1 Sam".

// Требования:

// Admin должен расширять User, а не дублировать его поля.
// Передать в describe обычного User и Admin — оба должны проходить.
// Объект без name или с role: "root" — ошибка компиляции.
// Проверь на одном User и одном Admin.

// Каким инструментом описать формы и как их связать — реши сам. Подумай, что здесь уместнее: interface или type, и почему.
// interface лучше подходит для описания структур данных, особенно когда нужно расширять сущности, как в случае с Admin, который расширяет User.
interface User {
  id: number;
  name: string;
}

interface Admin extends User {
  role: "admin";
}

function describe(u: User): string {
  return `#${u.id} ${u.name}`;
}

function main(): void {
  const user: User = { id: 1, name: "Sam" };
  const admin: Admin = { id: 2, name: "Alice", role: "admin" };

    console.log(describe(user)); // Output: #1 Sam
    console.log(describe(admin)); // Output: #2 Alice

    // const invalidUser: User = { id: 3 }; // Ошибка компиляции: отсутствует поле name
    // const invalidAdmin: Admin = { id: 4, name: "Bob", role: "root" }; // Ошибка компиляции: role должно быть "admin"
}

main();