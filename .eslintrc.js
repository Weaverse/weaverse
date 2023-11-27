/**
 * @type {import("@types/eslint").Linter.BaseConfig}
 */
module.exports = {
  env: {
    browser: true,
    es2023: true,
    node: true,
  },
  extends: ["@remix-run/eslint-config"],
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/naming-convention": "off",
    "hydrogen/prefer-image-component": "off",
    "no-useless-escape": "off",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
    "no-case-declarations": "off",
    "jest/no-deprecated-functions": "off",
    "eslint-comments/disable-enable-pair": "off",
    "prefer-const": "off",
    "no-console": "off",
    "@typescript-eslint/triple-slash-reference": "warn",
    "react/display-name": "off",
  },
}
