import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable the rule that errors on unused variables
      "@typescript-eslint/no-unused-vars": "off",
      // Disable the rule that forbids explicit any types
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
