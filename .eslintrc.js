module.exports = {
  "extends": [
    "eslint:recommended",
    "prettier",
  ],
  "rules": {
    "no-console": ["error", {
      "allow": ["warn", "error", "info"],
    }],
  },
  "env": {
    "node": true,
    "es6": true,
    "mocha": true,
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
  },
  // "parser": "babel-eslint",
};