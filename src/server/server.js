import path from 'path';
import express from 'express';
import webpack from 'webpack';
import routes from '../server/routes';
import bodyParser from 'body-parser';
import compression from 'compression';
import https from 'https';

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(compression());

let webpackConfig;

if (app.get('env') === 'development') {
	webpackConfig = require('../../webpack.config.dev');
} else if (app.get('env') === 'production') {
	webpackConfig = require('../../webpack.config.prod');
}

let webpackCompiler = webpack(webpackConfig);

app.use(
	require('webpack-dev-middleware')(webpackCompiler, {
		hot: true,
		noInfo: true,
		publicPath: webpackConfig.output.publicPath,
		stats: {
			colors: true,
		},
	})
);

app.use(
	require('webpack-hot-middleware')(webpackCompiler, {
		log: console.log,
		path: '/__webpack_hmr',
		heartbeat: 10 * 1000,
	})
);

app.use(express.static(__dirname + '/dist/'));

routes(app);

setInterval(() => https.get('https://soundexplorer.herokuapp.com/'), 3600000);

app.get('/*', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

app.listen(process.env.PORT || 3000, () => console.log(`Listening at http://localhost:${process.env.PORT || 3000}`));
