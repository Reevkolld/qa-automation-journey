// Есть функция parseConfig(raw: string), которая делает JSON.parse(raw) и должна вернуть объект с полями host: string и port: number.

// Требования:

// Тип того, что возвращает JSON.parse, не должен позволять сразу обращаться к .host/.port без проверки — компилятор обязан заставить тебя проверить форму данных.
// Если поля отсутствуют или не того типа — функция бросает понятную ошибку, а не возвращает мусор.
// В коде функции не должно быть any (ни явного, ни неявного при strict: true).
// Проверь на трёх входах: валидный JSON, JSON без port, строка-не-JSON.

// Сам реши, каким типом принять результат JSON.parse и как сузить его до нужной формы. Конструкцию не подсказываю — это часть задачи.

function parseConfig(raw: string): { host: string; port: number } {
  const parsed: unknown = JSON.parse(raw); // Используем unknown для того, чтобы компилятор не позволял обращаться к полям без проверки
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Invalid JSON format");
  }
  if (!("host" in parsed) || !("port" in parsed)) {
    throw new Error("Missing required fields");
  }
  if (typeof parsed.host !== "string") {
    throw new Error("Invalid host");
  }
  if (typeof parsed.port !== "number") {
    throw new Error("Invalid port");
  }
  return { host: parsed.host, port: parsed.port };
}

function main(): void {
  // Валидный JSON
  const validJson = '{"host": "localhost", "port": 8080}';
  try {
    const config = parseConfig(validJson);
    console.log("Valid JSON:", config);
  } catch (error) {
    console.error("Error parsing valid JSON:", error instanceof Error ? error.message : error);
  }

  // JSON без port
  const missingPortJson = '{"host": "localhost"}';
  try {
    const config = parseConfig(missingPortJson);
    console.log("Missing port JSON:", config);
  } catch (error) {
    console.error(
      "Error parsing JSON without port:",
      error instanceof Error ? error.message : error,
    );
  }

  // Строка-не-JSON
  const invalidJson = "not a JSON string";
  try {
    const config = parseConfig(invalidJson);
    console.log("Invalid JSON:", config);
  } catch (error) {
    console.error("Error parsing invalid JSON:", error instanceof Error ? error.message : error);
  }
}

main();
