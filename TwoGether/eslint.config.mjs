import { type Config } from "eslint";

const config: Config = {
    extends: ["next/core-web-vitals"],
    rules: {
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/no-explicit-any": "warn",
        "prefer-const": "warn",
    },
};

export default config;
