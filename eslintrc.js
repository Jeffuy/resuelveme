module.exports = {
	env: {
		browser: true,
		amd: true,
		node: true,
		es6: true,
	},
	extends: ['eslint:recommended', 'plugin:jsx-a11y/recommended', 'plugin:prettier/recommended', 'next', 'next/core-web-vitals'],
	rules: {
		//semi: ['error', 'never'],
		//'no-console': 'warn',
		semi: ['error', 'always'],
		'jsx-a11y/click-events-have-key-events': 'off',
		'jsx-a11y/no-noninteractive-element-interactions': 'off',
		'jsx-a11y/no-static-element-interactions': 'off',
		'jsx-a11y/anchor-is-valid': 'off',
		'@next/next/no-html-link-for-pages': 'off',
		'prettier/prettier': [
			'warn',
			{
				printWidth: 200,
				trailingComma: 'es5',
				tabWidth: 4,
				semi: true,
				useTabs: true,
				singleQuote: true,
				bracketSpacing: true,
				arrowParens: 'avoid',
				endOfLine: 'auto',
			},
		],
		'react/self-closing-comp': 'warn',
		'react/jsx-sort-props': [
			'warn',
			{
				callbacksLast: true,
				shorthandFirst: true,
				noSortAlphabetically: false,
				reservedFirst: true,
			},
		],
	},
};