// Дан тип:

// type User = { id: number; name: string; email: string; password: string };
// Собери из него три производных типа без переписывания полей руками и используй их:

// UserUpdate — все поля необязательны. Напиши applyUpdate(user: User, patch: UserUpdate): User, возвращающую нового пользователя с наложенным патчем.
// PublicUser — User без password. Напиши toPublic(user: User): PublicUser.
// UserPreview — только id и name.
// Требования:

// Производные типы получены из User подходящими utility types (не описаны заново).
// Без any. toPublic не должен возвращать объект с password (компилятор проверит).
// Проверь: создай User, примени патч { name: "New" }, выведи toPublic и UserPreview.

// Какими utility types собрать каждый вариант — реши сам (конспект: Partial / Pick / Omit).

type User = { id: number; name: string; email: string; password: string };

type UserUpdate = Partial<User>;
type PublicUser = Omit<User, "password">;
type UserPreview = Pick<User, "id" | "name">;

function applyUpdate(user: User, patch: UserUpdate): User {
    return { ...user, ...patch };
}

function toPublic(user: User): PublicUser {
    return { id: user.id, name: user.name, email: user.email};
}

function getUserPreview(user: User): UserPreview {
    return { id: user.id, name: user.name };
}

function main(): void {
    const user: User = { id: 1, name: "Sam", email: "sam@example.com", password: "secret" };
    const updatedUser = applyUpdate(user, { name: "New Name" });
    console.log("updated user:", updatedUser); // Output: { id: 1, name: "New Name", email: "sam@example.com", password: "secret" }
    const publicUser = toPublic(user);
    console.log("public user:", publicUser); // Output: { id: 1, name: "Sam", email: "sam@example.com" }
    const userPreview = getUserPreview(user);
    console.log("user preview:", userPreview); // Output: { id: 1, name: "Sam" }
}

main();