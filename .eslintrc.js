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
		'vue/no-v-text-v-html-on-component': 0,
		'vue/max-attributes-per-line': 0,
		'vue/v-slot-style': 0,
		'vue/mustache-interpolation-spacing': 0,
		'vue/require-prop-types': 0,
		'vue/no-v-html': 0,
		'vue/html-self-closing': 0,
	},
};
