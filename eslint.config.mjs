import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  { ignores: ["node_modules", "dist"] },
  js.configs.recommended, // базовые JS-правила
  ...tseslint.configs.recommended, // правила для TypeScript
  { languageOptions: { globals: { ...globals.node } } }, // console/process — не ошибка
  prettier, // ПОСЛЕДНИМ: гасит конфликты с Prettier
);
