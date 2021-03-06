const path = require('path');
const express = require('express');
const webpack = require('webpack');
const routes = require('../server/routes');
const bodyParser = require('body-parser');
const compression = require('compression');
const https = require('https');
const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(compression());

let webpackConfig;

const environment = app.get('env');

switch (environment) {
	case 'production':
		webpackConfig = require('../../webpack.config.prod');
		break;
	default:
		webpackConfig = require('../../webpack.config.dev');
		break;
}

const webpackCompiler = webpack(webpackConfig);

app.use(
	require('webpack-dev-middleware')(webpackCompiler, {
		hot: true,
		publicPath: webpackConfig.output.publicPath,
		stats: 'errors-only',
		logLevel: 'silent',
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

// Keep Heroku server awake
setInterval(() => https.get('https://soundexplorer.herokuapp.com/'), 1800000);

app.get('/*', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

app.listen(process.env.PORT || 3000, () => console.log(`\nListening on port ${process.env.PORT || 3000}\n`));
