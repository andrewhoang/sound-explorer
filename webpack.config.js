const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ManifestPlugin = require('webpack-manifest-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = {
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
		new InjectManifest({
			swSrc: './src-sw.js',
			swDest: './sw.js',
		}),
		new ManifestPlugin({
			seed: {
				name: 'SoundExplorer',
				short_name: 'Sound Explorer',
				start_url: '.',
				display: 'standalone',
				background_color: '#ffffff',
				icons: [
					{
						src: 'images/rocket.png',
						sizes: '192x192',
						type: 'image/png',
					},
				],
			},
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
		// new HtmlWebpackPlugin({ template: './src/index.html' }),
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
