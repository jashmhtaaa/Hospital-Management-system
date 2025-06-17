module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
    "no-console": "warn",
    "prefer-const": "error",
    "no-var": "error",
  },
  ignorePatterns: [
    "node_modules/",
    ".next/",
    "dist/",
    "build/",
    "coverage/",
  ],
};