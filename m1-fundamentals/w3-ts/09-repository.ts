// Напиши класс Repository, который хранит в памяти сущности и умеет: add(item), getById(id), all(). Класс должен работать с любой сущностью, у которой есть числовое поле id.

// Требования:

// Класс параметризован типом сущности; тип-параметр ограничен формой «есть id: number».
// getById возвращает сущность или undefined, с сохранённым типом (не any).
// Попытка создать Repository с типом без id — ошибка компиляции.
// Никакого any.
// Проверь: создай Repository для { id: number; name: string }, добавь пару записей, найди по id, выведи all().

// Как параметризовать класс и как потребовать наличие id — реши сам (конспект: разделы про generic-класс и ограничения).
// Используем generic-класс с ограничением типа через extends, чтобы гарантировать наличие поля id: number в сущности
// Using a generic class with a type constraint via extends ensures that the entity has an id: number field.

class Repository<T extends { id: number }> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  getById(id: number): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  all(): T[] {
    return this.items;
  }
}

function main(): void {
  const userRepository = new Repository<{ id: number; name: string }>();
  userRepository.add({ id: 1, name: "Alice" });
  userRepository.add({ id: 2, name: "Bob" });

  console.log(userRepository.getById(1)); // Output: { id: 1, name: "Alice" }
  console.log(userRepository.getById(3)); // Output: undefined
  console.log(userRepository.all()); // Output: [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]

  // const invalidRepository = new Repository<{ name: string }>(); // Ошибка компиляции: отсутствует поле id
}

main();
