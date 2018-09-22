const path = require('path');
const webpack = require('webpack');
const config = require('config');

const GLOBALS = {
	API_BASE_URL: JSON.stringify(
		process.env.API_BASE_URL || `${config.api.host}:${config.api.port}${config.api.baseUrl}`
	),
};

module.exports = {
	mode: 'development',
	devtool: 'cheap-module-eval-source-map',
	entry: ['@babel/polyfill', 'eventsource-polyfill', 'webpack-hot-middleware/client', './src/index'],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/static/',
	},
	plugins: [new webpack.DefinePlugin(GLOBALS), new webpack.HotModuleReplacementPlugin()],
	module: {
		rules: [
			{
				test: /\.js?/,
				exclude: [/node_modules/, /styles/],
				use: ['babel-loader'],
				include: path.join(__dirname, 'src'),
			},
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
		],
	},
};
