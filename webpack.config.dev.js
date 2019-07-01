const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
	mode: 'development',
	devtool: 'cheap-module-eval-source-map',
	entry: [
		// '@babel/polyfill',
		'eventsource-polyfill',
		'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
		'./src/client/index',
	],
	stats: 'errors-only',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/',
	},
	node: {
		fs: 'empty',
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin({ multiStep: true }),
		// new HtmlWebpackPlugin({ template: './src/index.html' }),
		new ManifestPlugin({
			seed: {
				name: 'SoundExplorer',
				short_name: 'SE',
				start_url: '.',
				display: 'standalone',
				theme_color: '#1a1a1a',
				background_color: '#ffffff',
				icons: [
					{
						src: 'favicon.ico',
						sizes: '64x64 32x32 24x24 16x16',
						type: 'image/x-icon',
					},
				],
			},
		}),
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
