// Смоделируй фигуру Shape, которая может быть кругом, квадратом или прямоугольником. Напиши area(s: Shape): number, считающую площадь.

// Требования:

// У каждого варианта — своё поле-дискриминант (общий ключ с литеральным значением), по которому различаются варианты.
// У круга — радиус, у квадрата — сторона, у прямоугольника — ширина и высота (набор полей у вариантов разный).
// В area раздели случаи и в каждом обращайся только к полям своего варианта.
// Добавь защиту полноты: если позже появится новый вид фигуры и его забудут обработать — должна быть ошибка компиляции (не рантайм).
// Проверь на трёх фигурах. Затем временно добавь четвёртый вид (triangle) в тип и убедись, что компилятор указывает на незакрытый вариант; верни обратно.

// Как именно устроить «различение вариантов» и «защиту полноты» — реши сам (мы это проходили в конспекте).

type Circle = {
  kind: "circle";
  radius: number;
};

type Square = {
  kind: "square";
  side: number;
};

type Rectangle = {
  kind: "rectangle";
  width: number;
  height: number;
};

type Shape = Circle | Square | Rectangle;

function area(s: Shape): number {
  switch (s.kind) {
    case "circle":
      return Math.PI * s.radius * s.radius;
    case "square":
      return s.side * s.side;
    case "rectangle":
      return s.width * s.height;
    default: {
      const _exhaustive: never = s;
      return _exhaustive;
    }
  }
}

function main(): void {
  const circle: Circle = { kind: "circle", radius: 5 };
  const square: Square = { kind: "square", side: 4 };
  const rectangle: Rectangle = { kind: "rectangle", width: 3, height: 6 };

  console.log(area(circle)); // Output: 78.53981633974483
  console.log(area(square)); // Output: 16
  console.log(area(rectangle)); // Output: 18
}

main();
