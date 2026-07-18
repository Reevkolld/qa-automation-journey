// Условие
// Смоделируй in-memory трекер тренировок (без БД) в файле w3-ts/12-tracker.ts.

// Доменные типы:

// Exercise — упражнение: id: number, name: string, muscleGroup — фиксированный набор значений (например "legs" | "back" | "chest" | "core").
// Set_ (сет) — reps: number, weightKg: number.
// Workout — тренировка: id: number, date: string, и список выполненных упражнений, у каждого — exerciseId и массив сетов.
// Хранилище (generic):
// 4. Переиспользуй свой Repository<T extends { id: number }> (из W3-09) — или похожий generic-класс — как хранилище для Workout и для Exercise. Один типобезопасный 
// контейнер под обе сущности.

// Операции:
// 5. addWorkout(w: Workout), getWorkoutById(id), allWorkouts().
// 6. updateWorkout(id, patch) — патч через Partial<...> (обновляет часть полей).
// 7. workoutSummary(id) — вернуть «превью» тренировки: только id и date (через Pick<...>), плюс общее число сетов.
// 8. totalVolume(id) — сумма reps * weightKg по всем сетам тренировки.

// Требования:

// Ни одного any; результат getWorkoutById/поиска — T | undefined (не any).
// Где перебираешь варианты muscleGroup в switch — добавь never-проверку полноты.
// Проверь на 2–3 тренировках: добавь, обнови патчем, посчитай totalVolume, выведи workoutSummary.
// Сам реши, какими конструкциями это собрать — вся неделя про это. Это не новая тема, а сборка пройденного.

interface Exercise {
    id: number;
    name: string;
    muscleGroup: "legs" | "back" | "chest" | "core";
}

interface Set_ {
    reps: number;
    weightKg: number;
}

interface Workout {
    id: number;
    date: string;
    exercises: {
        exerciseId: number;
        sets: Set_[];
    }[];
}

class Repository<T extends { id: number }> {
    private items: T[] = [];

    add(item: T): void {
        this.items.push(item);
    }

    getById(id: number): T | undefined {
        return this.items.find(item => item.id === id);
    }

    all(): T[] {
        return this.items;
    }

    update(id: number, patch: Partial<T>): void {
        const item = this.getById(id);
        if (item) {
            Object.assign(item, patch);
        }
    }
}

function workoutSummary(workout: Workout): { id: number; date: string; totalSets: number } {
    const totalSets = workout.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
    return { id: workout.id, date: workout.date, totalSets };
}

function totalVolume(workout: Workout): number {
    return workout.exercises.reduce((total, exercise) => {
        return total + exercise.sets.reduce((sum, set) => sum + set.reps * set.weightKg, 0);
    }, 0);
}

function muscleGroupLabel(g: Exercise["muscleGroup"]): string {
  switch (g) {
    case "legs":  return "Ноги";
    case "back":  return "Спина";
    case "chest": return "Грудь";
    case "core":  return "Кор";
    default:
      const _exhaustive: never = g; // добавишь 5-й вариант в тип и забудешь case → ошибка тут
      return _exhaustive;
  }
}

function main(): void {
    const exerciseRepo = new Repository<Exercise>();
    const workoutRepo = new Repository<Workout>();

    // Add exercises
    exerciseRepo.add({ id: 1, name: "Squat", muscleGroup: "legs" });
    exerciseRepo.add({ id: 2, name: "Deadlift", muscleGroup: "back" });
    exerciseRepo.add({ id: 3, name: "Bench Press", muscleGroup: "chest" });

    // Add workouts
    workoutRepo.add({
        id: 1,
        date: "2024-06-01",
        exercises: [
            { exerciseId: 1, sets: [{ reps: 10, weightKg: 100 }, { reps: 8, weightKg: 110 }] },
            { exerciseId: 2, sets: [{ reps: 5, weightKg: 150 }] },
        ],
    }); 

    workoutRepo.add({
        id: 2,
        date: "2024-06-02",
        exercises: [
            { exerciseId: 3, sets: [{ reps: 12, weightKg: 80 }, { reps: 10, weightKg: 90 }] },
        ],
    });
    
    // Update a workout
    workoutRepo.update(1, { date: "2024-06-03" });

    // Get workout summary
    const workout1 = workoutRepo.getById(1);

    if (workout1) {
        console.log("Workout Summary:", workoutSummary(workout1));
        console.log("Total Volume:", totalVolume(workout1));
    }
    else {
        console.log("Workout not found");
    }

    const workout2 = workoutRepo.getById(2);
    if (workout2) {
        console.log("Workout Summary:", workoutSummary(workout2));
        console.log("Total Volume:", totalVolume(workout2));
    }
    else {
        console.log("Workout not found");
    }

    // List all workouts
    console.log("All Workouts:", workoutRepo.all());

    exerciseRepo.all().forEach(ex => {
        console.log(`Exercise: ${ex.name}, Muscle Group: ${muscleGroupLabel(ex.muscleGroup)}`);
    });

}

main();
