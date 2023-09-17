module.exports = {
    "env": {
        "es2021": true,
        "node": true
    },
    "extends": [
        "standard-with-typescript",
        "prettier"
    ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "project": "./tsconfig.json"
    },
    "rules": {
        "@typescript-eslint/indent": "off",
        "@typescript-eslint/naming-convention": "off",
        "@typescript-eslint/no-misused-promises": "off",
    }
}
