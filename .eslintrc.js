module.exports = {
  // true일 경우 더 이상 lint 대상을 찾으러 상위 폴더로 올라가지 않음.
  root: true,
  extends: '@react-native',
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', {ignoreRestSiblings: true}],
  },
};
