const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
	transpileDependencies: ['vuetify'],
	pwa: {
		themeColor: '#17a2b8',
		msTileColor: '#000000',
		iconPaths: {
			faviconSVG: 'img/icons/favicon.svg',
			favicon32: 'img/icons/favicon-32x32.png',
			favicon16: 'img/icons/favicon-16x16.png',
			appleTouchIcon: 'img/icons/apple-icon-180x180.png',
			maskIcon: 'img/icons/ms-icon-144x144.png',
			msTileImage: 'img/icons/ms-icon-150x150.png',
		},
	},
	publicPath: process.env.NODE_ENV === 'production' ? '/crm/' : '/',
});
