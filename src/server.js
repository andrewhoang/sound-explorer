import path from 'path';
import express from 'express';
import webpack from 'webpack';
import addApiRoutes from '../api/addApiRoutes';
import bodyParser from 'body-parser';
import compression from 'compression';

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(compression());

let webpackConfig;

if (app.get('env') === 'development') {
	webpackConfig = require('../webpack.config.dev');
} else if (app.get('env') === 'production') {
	webpackConfig = require('../webpack.config.prod');
}

let webpackCompiler = webpack(webpackConfig);

app.use(
	require('webpack-dev-middleware')(webpackCompiler, {
		noInfo: true,
		publicPath: webpackConfig.output.publicPath,
		stats: false,
	})
);

app.use(require('webpack-hot-middleware')(webpackCompiler));

addApiRoutes(app);

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(process.env.PORT || 3000, err => {
	if (err) {
		console.log('Error', err);
		return;
	}

	console.log(`Listening at http://localhost:${process.env.PORT || 3000}`);
});
