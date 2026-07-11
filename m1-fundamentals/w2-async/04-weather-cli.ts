// =============================================================
// 04 — Мини-проект недели: Weather CLI
// CLI-скрипт: через fetch берёт текущую погоду для 5 городов
// ПАРАЛЛЕЛЬНО (Promise.allSettled — часть городов может не ответить,
// это не должно ронять весь запуск), выводит таблицу.
// Собирает всю неделю W2: промисы, async/await, Promise.allSettled,
// параллельность vs последовательность.
// API без ключа: https://open-meteo.com/en/docs (current_weather=true)

type City = {
  name: string;
  latitude: number;
  longitude: number;
};

type WeatherResult = {
  city: string;
  status: "ok" | "error";
  temperature?: number;
  windspeed?: number;
  message?: string;
};

const cities: City[] = [
  { name: "Kyiv", latitude: 50.45, longitude: 30.52 },
  { name: "Berlin", latitude: 52.52, longitude: 13.40 },
  { name: "London", latitude: 51.51, longitude: -0.13 },
  { name: "Warsaw", latitude: 52.23, longitude: 21.01 },
  { name: "Lisbon", latitude: 38.72, longitude: -9.14 }
];

async function fetchWeather(city: City): Promise<WeatherResult> {
  try{
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current_weather=true`;
    const response = await fetch(url);
    if (!response.ok) {
      return { city: city.name, status: "error", message: `HTTP error! status: ${response.status}` };
    }
    const data = await response.json();
    const temperature = data.current_weather.temperature;
    const windspeed = data.current_weather.windspeed;
    return { city: city.name, status: "ok", temperature, windspeed };
  }
  catch(error){
    return { city: city.name, status: "error", message: (error as Error).message};
  }
}

async function main() {
  console.time("weather-cli");
  const results = await Promise.all(cities.map(fetchWeather));
  console.timeEnd("weather-cli");
  console.table(results);
}

async function mainSequential() {
  console.time("weather-cli-sequential");
  const results: WeatherResult[] = [];
  for (const city of cities) {
    const result = await fetchWeather(city);
    results.push(result);
  }
  console.timeEnd("weather-cli-sequential");
  console.table(results);
}

main();
mainSequential();


// -------------------------------------------------------------
// ВЫВОД: своими словами —
// (а) почему здесь используется Promise.all (или allSettled), а не
//     последовательный await в цикле — в чём конкретно выигрыш для
//     ЭТОЙ задачи (5 независимых сетевых запросов)?
// Использовался Promise.all, потому что все 5 запросов к API погоды являются независимыми друг от друга. 
// Он позволяет отправить все запросы параллельно, что значительно сокращает общее время выполнения по сравнению с последовательным выполнением 
// запросов в цикле. В случае последовательного await каждый запрос будет ждать завершения предыдущего, что увеличивает общее время ожидания

// (б) если бы один из городов имел невалидные координаты и API вернул
//     ошибку — что произошло бы с остальными 4 городами при твоей
//     реализации? Почему именно так?
//  Города с невалидными координатами вернут ошибку, но остальные 4 города продолжат выполняться и вернут свои результаты
// Это происходит потому что каждый запрос обрабатывается независимо, и ошибка одного запроса не влияет на выполнение других запросов.
// -------------------------------------------------------------
