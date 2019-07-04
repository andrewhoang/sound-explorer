const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ManifestPlugin = require('webpack-manifest-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = {
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
		new InjectManifest({
			swSrc: './src-sw.js',
			swDest: './sw.js',
		}),
		new ManifestPlugin({
			seed: {
				name: 'SoundExplorer',
				short_name: 'Sound Explorer',
				start_url: 'https://soundexplorer.herokuapp.com/',
				display: 'standalone',
				orientation: 'portrait',
				background_color: '#1db954',
				icons: [
					{
						src: 'images/rocket-512.png',
						sizes: '512x512',
						type: 'image/png',
					},
				],
			},
		}),
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
