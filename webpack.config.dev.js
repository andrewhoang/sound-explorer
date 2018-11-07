const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	entry: [
		'@babel/polyfill',
		'eventsource-polyfill',
		'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
		'./src/client/index',
	],
	output: {
		path: path.join(__dirname, '/dist/'),
		filename: 'bundle.js',
		publicPath: '/',
	},
	node: {
		fs: 'empty',
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin({
			multiStep: true,
		}),
		new HtmlWebpackPlugin({ template: './src/index.html' }),
		new webpack.optimize.OccurrenceOrderPlugin(),
		// new BundleAnalyzerPlugin(),
	],
	module: {
		rules: [
			{
				test: /\.js?/,
				exclude: /node_modules/,
				use: 'babel-loader',
				include: path.join(__dirname, 'src'),
			},
			{
				test: /\.(s*)css$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
			// {
			// 	test: /\.(jpe?g|png|gif|svg|ico)$/i,
			// 	use: ['url-loader?limit=10000'],
			// },
			{
				test: /\.(jpe?g|png|gif|svg|ico)$/i,
				use: {
					loader: 'file-loader',
					options: {
						name: 'images/[name].[ext]',
					},
				},
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
