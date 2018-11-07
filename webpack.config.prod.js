const path = require('path');
const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
	mode: 'production',
	devtool: 'source-map',
	performance: {
		hints: false,
	},
	entry: ['@babel/polyfill', './src/client/index'],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/static/',
	},
	optimization: {
		minimizer: [new OptimizeCSSAssetsPlugin({})],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				use: ['babel-loader'],
				include: path.join(__dirname, 'src'),
			},
			{
				test: /\.(s*)css$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /\.(jpe?g|png|gif|svg|ico)$/i,
				use: [
					'url-loader?limit=10000',
					{
						loader: 'img-loader',
						options: {
							name: 'images/[name].[ext]',
							enabled: process.env.NODE_ENV === 'production',
							gifsicle: {
								interlaced: false,
							},
							mozjpeg: {
								progressive: true,
								arithmetic: false,
							},
							optipng: false, // disabled
							pngquant: {
								floyd: 0.5,
								speed: 2,
							},
							svgo: {
								plugins: [{ removeTitle: true }, { convertPathData: false }],
							},
						},
					},
				],
			},
			{
				test: /\.(ttf|eot|woff|woff2|svg)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: 'fonts/[name].[ext]',
					},
				},
			},
		],
	},
};
