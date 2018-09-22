import path from 'path';
import express from 'express';
import webpack from 'webpack';
import addApiRoutes from './api/addApiRoutes';
import bodyParser from 'body-parser';
import config from 'config';
import querystring from 'querystring';

const app = express();

let webpackConfig;

if (app.get('env') === 'development') {
	webpackConfig = require('./webpack.config.dev');
} else if (app.get('env') === 'production') {
	webpackConfig = require('./webpack.config.prod');
}

let webpackCompiler = webpack(webpackConfig);

app.use(
	require('webpack-dev-middleware')(webpackCompiler, {
		noInfo: true,
		publicPath: webpackConfig.output.publicPath,
	})
);

app.use(require('webpack-hot-middleware')(webpackCompiler));

// addApiRoutes(app);

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, 'localhost', err => {
	if (err) {
		console.log(err);
		return;
	}

	console.log('Listening at http://localhost:3000');
});
