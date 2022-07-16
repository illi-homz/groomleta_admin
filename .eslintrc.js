require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
	root: true,
	extends: [
		'plugin:vue/recommended', // Use this if you are using Vue.js 2.x.
		'@vue/eslint-config-typescript',
	],
	rules: {
		'ts-nocheck': 0,
		'vue/html-indent': 0,
		'vue/singleline-html-element-content-newline': 0,
	},
};
