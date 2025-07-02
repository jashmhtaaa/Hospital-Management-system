export default [
	{
		ignores: ['**/*', '!enterprise/**/*']
	},
	{
		files: ['enterprise/**/*.ts', 'enterprise/**/*.tsx'],
		languageOptions: {
			parserOptions: {
				project: './tsconfig.json'
			}
		},
		rules: {}
	}
];
