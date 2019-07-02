const path = require('path');
const common = require('./webpack.config.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const merge = require('webpack-merge');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
	mode: 'production',
	devtool: 'source-map',
	performance: {
		hints: false,
	},
	entry: ['@babel/polyfill', './src/client/index'],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/',
	},
	optimization: {
		minimizer: [new OptimizeCSSAssetsPlugin({})],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
		// new HtmlWebpackPlugin({ template: './src/index.html' }),
	],
});
