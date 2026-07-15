// Напиши функцию toSelectors(input: string | string[]): string[] — она принимает либо один селектор строкой, либо массив селекторов, и всегда возвращает массив.

// Требования:

// Внутри — сузить тип и обработать оба случая: строку обернуть в массив [input], массив вернуть как есть.
// Тип возврата строго string[].
// Без any и без приведения через as.
// Бонус: добавь перегруз мыслей на будущее — что вернуть, если строка пустая? (реши сам, опиши в «Что выучил»)
// Проверь на входах: "button", ["a", "b"], [].

// Каким инструментом различить строку и массив — реши сам (в конспекте это раздел про narrowing).

function toSelectors(input: string | string[]): string[] {
  if (typeof input === "string") {
    return input ? [input] : []; // Если строка пустая, возвращаем пустой массив
  } else {
    return input; // Если это массив, возвращаем его как есть
  }
}

function main(): void {
  console.log(toSelectors("button")); // Output: ["button"]
  console.log(toSelectors(["a", "b"])); // Output: ["a", "b"]
  console.log(toSelectors([])); // Output: []
  console.log(toSelectors("")); // Output: []
}

main();