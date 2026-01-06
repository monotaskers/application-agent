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
      "@typescript-eslint/no-explicit-any": [
        "error",
        {
          ignoreRestArgs: false,
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      // Enforce proper escaping of entities in JSX text content
      "react/no-unescaped-entities": [
        "error",
        {
          forbid: [
            { char: '"', alternatives: ["&quot;", "&ldquo;", "&#34;", "&rdquo;"] },
            { char: "'", alternatives: ["&apos;", "&lsquo;", "&#39;", "&rsquo;"] },
            { char: ">", alternatives: ["&gt;"] },
            { char: "}", alternatives: ["&#125;"] },
          ],
        },
      ],
    },
  },
  {
    files: ["**/__tests__/**/*", "**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
