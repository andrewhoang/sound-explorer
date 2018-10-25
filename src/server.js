import path from 'path';
import express from 'express';
import webpack from 'webpack';
import addApiRoutes from '../api/addApiRoutes';
import bodyParser from 'body-parser';
import request from 'request';
import compression from 'compression';
import querystring from 'querystring';

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(compression());

let webpackConfig;

console.log('ENV', app.get('env'));

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

let redirect_uri = process.env.REDIRECT_URI || 'https://soundexplorer.herokuapp.com/callback';
let scope = `playlist-modify-private
	 playlist-modify-public 
	 user-read-private 
	 user-read-email 
	 user-modify-playback-state
	 user-read-playback-state
	 user-top-read
	 user-follow-read
	 ugc-image-upload
	 playlist-modify-public
	 playlist-modify-private`;

app.get('/login', (req, res) => {
	res.redirect(
		'https://accounts.spotify.com/authorize?' +
			querystring.stringify({
				response_type: 'code',
				client_id: process.env.SPOTIFY_CLIENT_ID,
				scope,
				redirect_uri,
			})
	);
});

app.get('/callback', (req, res) => {
	let code = req.query.code || null;
	let authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		form: {
			code: code,
			redirect_uri,
			grant_type: 'authorization_code',
		},
		headers: {
			Authorization:
				'Basic ' +
				new Buffer(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'),
		},
		json: true,
	};
	request.post(authOptions, (error, response, body) => {
		let access_token = body.access_token;
		let refresh_token = body.refresh_token;

		let uri = process.env.FRONTEND_URI || 'https://soundexplorer.herokuapp.com/';
		res.redirect(uri + '?access_token=' + access_token + '&refresh_token=' + refresh_token);
	});
});

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
