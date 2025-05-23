import js from "@eslint/js";
import globals from "globals";
import {configs} from "typescript-eslint";
import expoConfig from "eslint-config-expo/flat.js";
import { defineConfig } from "eslint/config";


export default defineConfig([
    { rules: { 'semi': ['error', 'always'] } },
    { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"] },
    { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], languageOptions: { globals: { ...globals.browser, ...globals.node } } },
    expoConfig,
    configs.recommended,
]);
