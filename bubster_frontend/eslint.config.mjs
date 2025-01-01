// typescript typecheck

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  reactRefresh.configs.vite,
);

