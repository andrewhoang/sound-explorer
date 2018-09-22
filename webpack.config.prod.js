const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: 'production',
	devtool: false,
	performance: {
		hints: false,
	},
	entry: ['@babel/polyfill', './src/index'],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/static/',
	},
	plugins: [],
	module: {
		rules: [
			{
				test: /\.js$/,
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
