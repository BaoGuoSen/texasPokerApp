// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: 'expo',
  ignorePatterns: ['/dist/*'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'no-undef': 'off',
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    'no-else-return': 'error',
    'comma-spacing': 'error',
    'object-curly-spacing': ['error', 'always'],
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-console': 'error',
    'no-const-assign': 'error',
    'no-constant-condition': 'error',
    'no-empty': 'warn',
    'no-func-assign': 'error',
    'no-inline-comments': 'error',
    'no-lonely-if': 'error',
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'no-trailing-spaces': 'error',
    camelcase: 'error',
    'no-dupe-keys': 'error',
    'no-nested-ternary': 'error',
    'no-param-reassign': 'error',
    'no-self-compare': 'error',
    'no-unneeded-ternary': 'error',
    'comma-dangle': ['error', 'never'],
    'arrow-spacing': 'error',
    'arrow-parens': 'error',
    // 立即执行函数风格
    'wrap-iife': ['error', 'inside'],
    'key-spacing': [
      'error',
      {
        afterColon: true
      }
    ]
  }
};
