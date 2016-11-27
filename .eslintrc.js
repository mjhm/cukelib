module.exports = {
    "extends": "airbnb",
    "rules": {
      "max-len": ["error", 100],
      "func-names": "off",
      "new-cap": ["error", { "capIsNewExceptions": ["Given", "Then", "And", "When", "But", "Before", "After"] }],
      "import/no-extraneous-dependencies": ["error", {"devDependencies": ["**/harness/support/**"]}],
      "no-underscore-dangle": ["error", { "allow": ["_cucapi"] }],
      "arrow-parens": ["error", "always"]
    },
    "installedESLint": true,
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "globals": {
      "expect": false
    }
};
