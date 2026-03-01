import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const eslintConfig = defineConfig([
  // ── Base: Next.js recommended + TypeScript ──────────────────
  ...nextVitals,
  ...nextTs,

  // ── Strict overrides ────────────────────────────────────────
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      // ── TypeScript ──────────────────────────────────────────
      /** Prohibe el uso de `any` explícito */
      "@typescript-eslint/no-explicit-any": "error",
      /** Variables/parámetros no usados son error (prefijo _ los excluye) */
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      /** Obliga `import type` para importaciones de solo tipos */
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      /** Prohíbe `!` (non-null assertion) */
      "@typescript-eslint/no-non-null-assertion": "error",
      /** Prohíbe `x as any` y `<any>x` */
      "@typescript-eslint/no-unsafe-assignment": "off", // requiere tipo en proyecto complejo
      /** Prefiere `interface` sobre `type` para objetos */
      "@typescript-eslint/consistent-type-definitions": ["warn", "interface"],
      /** Prohíbe `Array<T>` a favor de `T[]` */
      "@typescript-eslint/array-type": ["warn", { default: "array" }],
      /** Prohíbe import de módulos que no existen (ya cubierto por TS, refuerzo) */
      "@typescript-eslint/no-require-imports": "error",

      // ── React ───────────────────────────────────────────────
      /** Prohíbe fragments vacíos o innecesarios */
      "react/jsx-no-useless-fragment": ["warn", { allowExpressions: true }],
      /** Auto-cierra componentes sin hijos: `<Comp />` */
      "react/self-closing-comp": "warn",
      /** Desaconseja usar índice de array como key */
      "react/no-array-index-key": "warn",
      /** `true` implícito en props booleanas: `<C disabled />` en vez de `<C disabled={true} />` */
      "react/jsx-boolean-value": ["warn", "never"],
      /** Orden de props en JSX: callbacks al final */
      "react/sort-prop-types": "off", // muy opinado, desactivado

      // ── Imports ─────────────────────────────────────────────
      /** Ordena automáticamente los imports */
      "simple-import-sort/imports": "error",
      /** Ordena automáticamente los exports */
      "simple-import-sort/exports": "error",

      // ── Calidad general ─────────────────────────────────────
      /** console.log en código → warning; console.warn/error permitidos */
      "no-console": ["warn", { allow: ["warn", "error"] }],
      /** debugger en código → siempre error */
      "no-debugger": "error",
      /** Siempre usar `const` si la variable no muta */
      "prefer-const": "error",
      /** Prohíbe `var` */
      "no-var": "error",
      /** Igualdad estricta `===` obligatoria */
      eqeqeq: ["error", "always", { null: "ignore" }],
      /** Prohíbe ternarios anidados (dificultan lectura) */
      "no-nested-ternary": "warn",
      /** Prohíbe coerciones implícitas: `!!x`, `+x`, `"" + x` */
      "no-implicit-coercion": ["warn", { allow: ["!!"] }],
      /** Prohíbe código inalcanzable después de return/throw */
      "no-unreachable": "error",
      /** Prohíbe return con y sin valor en la misma función */
      "consistent-return": "warn",
    },
  },

  // ── Ignores ─────────────────────────────────────────────────
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "reference/**",
  ]),
]);

export default eslintConfig;
