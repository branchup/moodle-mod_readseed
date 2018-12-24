module.exports = {
    parser: 'babel-eslint',
    env: {
        browser: true,
        node: true,
        es6: true,
        jquery: true
    },
    extends: ['eslint:recommended', 'plugin:react/recommended'],
    parserOptions: {
        ecmaVersion: 7,
        ecmaFeatures: {
            experimentalObjectRestSpread: true
        }
    },
    plugins: ['react'],
    globals: {},
    rules: {
        indent: 'off',
        'linebreak-style': ['error', 'unix'],
        'no-unused-vars': ['error', { args: 'none' }],
        'no-empty': 'off',
        'react/display-name': 'off',
        'promise/avoid-new': 'off',
        'promise/always-return': 'off',
        semi: ['error', 'always']
    },
    settings: {
        react: {
            version: '16.7'
        }
    }
};
