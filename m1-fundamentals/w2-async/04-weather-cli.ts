// =============================================================
// 04 — Мини-проект недели: Weather CLI
// CLI-скрипт: через fetch берёт текущую погоду для 5 городов
// ПАРАЛЛЕЛЬНО (Promise.allSettled — часть городов может не ответить,
// это не должно ронять весь запуск), выводит таблицу.
// Собирает всю неделю W2: промисы, async/await, Promise.allSettled,
// параллельность vs последовательность.
// API без ключа: https://open-meteo.com/en/docs (current_weather=true)

// тип ответа API (то, что реально приходит из open-meteo) — принять как unknown и сузить или описать interface/type для нужных полей;
// тип конфига (список городов) и тип результата (строка таблицы);

type City = {
    name: string;
    latitude: number;
    longitude: number;
};

type WeatherResponse = {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    time: string;
};

type WeatherResult = {
    city: City;
    weather: WeatherResponse | null;
    error?: string;
};

function fetchWeather(city: City): Promise<WeatherResult> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current_weather=true`;
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data: unknown) => {
        if (
    typeof data === "object" && data !== null &&
    "current_weather" in data
  ) {
    return { city, weather: (data as { current_weather: WeatherResponse }).current_weather };
  }
  throw new Error("unexpected API shape");
})
        .catch(error => {
            return { city, weather: null, error: error.message };
        });
}

function formatWeatherTable(results: WeatherResult[]): string {
    console.table(results.map(result => ({
        City: result.city.name,
        Temperature: result.weather ? `${result.weather.temperature} °C` : 'N/A',
        Windspeed: result.weather ? `${result.weather.windspeed} km/h` : 'N/A',
        Winddirection: result.weather ? `${result.weather.winddirection} °` : 'N/A',
        Error: result.error || ''
    })));
    return '';
}

async function main(): Promise<void> {
    const cities: City[] = [
        { name: "New York", latitude: 40.7128, longitude: -74.0060 },
        { name: "London", latitude: 51.5074, longitude: -0.1278 },
        { name: "Tokyo", latitude: 35.6895, longitude: 139.6917 },
        { name: "Sydney", latitude: -33.8688, longitude: 151.2093 },
        { name: "Moscow", latitude: 55.7558, longitude: 37.6173 }
    ];

    const weatherPromises = cities.map(city => fetchWeather(city));
    const results = await Promise.allSettled(weatherPromises);

    const weatherResults: WeatherResult[] = results.map(result => {
        if (result.status === 'fulfilled') {
            return result.value;
        } else {
            return { city: { name: 'Unknown', latitude: 0, longitude: 0 }, weather: null, error: result.reason };
        }
    });

    formatWeatherTable(weatherResults);
}

main();