// Опиши тип географической координаты [широта, долгота] — ровно два числа, и функцию distanceKm(a, b), которая считает расстояние (можно грубую формулу — не суть, суть в типах).

// Требования:

// Передать один элемент или три должно быть ошибкой компиляции — не undefined в рантайме.
// Обе позиции — number; перепутать порядок «строка/число» компилятор тоже не должен позволить.
// Верни из distanceKm number; если на вход пришло что-то невалидное по типу — до вызова это не дойдёт (ловит компилятор).
// Проверь на двух валидных координатах и убедись, что distanceKm([1], [2, 3]) не компилируется.

// Какой тип точно выражает «ровно два числа на фиксированных позициях» — реши сам. Обычный массив number[] здесь не подойдёт; подумай, почему.

function distanceKm(a: [number, number], b: [number, number]): number{
  const lat1 = a[0];
  const lon1 = a[1];
  const lat2 = b[0];
  const lon2 = b[1];

    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const aCalc = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(aCalc), Math.sqrt(1 - aCalc));
    const distance = R * c;

    return distance;
}

function main(): void {
  const coord1: [number, number] = [52.5200, 13.4050];
    const coord2: [number, number] = [48.8566, 2.3522];
    const dist = distanceKm(coord1, coord2);
    console.log(`Distance between coordinates: ${dist.toFixed(2)} km`);

    // const invalidDist = distanceKm([1], [2, 3]); // Ошибка компиляции на второй координате
}

main();
