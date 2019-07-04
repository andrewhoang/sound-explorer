const webpack = require('webpack');
const common = require('./webpack.config.js');
const path = require('path');
const merge = require('webpack-merge');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'cheap-module-eval-source-map',
	stats: 'errors-only',
	entry: [
		'@babel/polyfill',
		'eventsource-polyfill',
		'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
		'./src/client/index',
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/',
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin({ multiStep: true }),
		// new BundleAnalyzerPlugin(),
	],
});
