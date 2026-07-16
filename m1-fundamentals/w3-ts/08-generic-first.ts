// Напиши функцию first, которая возвращает первый элемент массива. Она должна работать с массивом любого типа и сохранять тип элемента (не any).

// Требования:

// first([1,2,3]) даёт результат типа number | undefined, first(["a","b"]) — string | undefined (тип элемента сохранён).
// Пустой массив тоже корректен по типу — результат может быть undefined.
// Никакого any.
// Проверь на массиве чисел, массиве строк и пустом массиве. Убедись, что тип результата разный (наведись в редакторе / попробуй вызвать метод, специфичный для числа,
// на строковом результате — должна быть ошибка).

// Какой инструмент «работает с любым типом, но сохраняет его» — реши сам (это тема сегодняшнего конспекта).
// Шаблонные типы (generics) позволяют функции работать с любым типом, сохраняя его.
// В данном случае мы используем параметр типа T, который представляет тип элементов массива.
// Template types (generics) allow the function to accept an array of any type T and return a value of type T or undefined, 
// depending on whether the array is empty or not.

function first<T>(a: T[]): T | undefined {
  return a[0];
}

function main(): void {
  const numArray = [1, 2, 3];
  const strArray = ["a", "b"];
  const emptyArray: number[] = [];
  const numResult = first(numArray);
  const strResult = first(strArray);
  const emptyResult = first(emptyArray);

    console.log(numResult); // Output: 1
    console.log(strResult); // Output: "a"
    console.log(emptyResult); // Output: undefined
}

main();