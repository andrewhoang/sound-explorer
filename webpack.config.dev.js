const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: 'development',
	devtool: 'cheap-module-eval-source-map',
	entry: ['@babel/polyfill', 'eventsource-polyfill', 'webpack-hot-middleware/client', './src/index'],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/static/',
	},
	plugins: [new webpack.HotModuleReplacementPlugin()],
	module: {
		rules: [
			{
				test: /\.js?/,
				exclude: [/node_modules/, /styles/],
				use: ['babel-loader'],
				include: path.join(__dirname, 'src'),
			},
			{
				test: /\.(s*)css$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				use: [
					'url-loader?limit=10000',
					{
						loader: 'img-loader',
						options: {
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
				test: /\.(woff|woff2)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							prefix: 'font',
							limit: 5000,
						},
					},
				],
			},
			{
				test: /\.(ttf|otf|eot)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10000,
							mimetype: 'application/octet-stream',
						},
					},
				],
			},
		],
	},
};
