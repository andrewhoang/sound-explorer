const request = require('request');
const querystring = require('query-string');

function routes(app) {
	app.use(require('./index.js'));

	const redirect_uri = process.env.REDIRECT_URI || 'http://localhost:3000/callback';
	const client_id = process.env.SPOTIFY_CLIENT_ID;
	const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

	const scope = `playlist-modify-private
	 playlist-modify-public
	 playlist-read-private
	 user-read-private 
	 user-read-email 
	 user-modify-playback-state
	 user-read-playback-state
	 user-top-read
	 user-library-read
	 user-follow-read
	 ugc-image-upload
	 user-read-recently-played
	 user-library-modify`;

	app.get('/login', (req, res) =>
		res.redirect(
			'https://accounts.spotify.com/authorize?' +
				querystring.stringify({ response_type: 'code', client_id, scope, redirect_uri })
		)
	);

	app.get('/callback', (req, res) => {
		const code = req.query.code || null;
		const authOptions = {
			url: 'https://accounts.spotify.com/api/token',
			form: {
				code,
				redirect_uri,
				grant_type: 'authorization_code',
			},
			headers: {
				Authorization: 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
			},
			json: true,
		};
		request.post(authOptions, (error, response, body) => {
			const access_token = body.access_token;
			const refresh_token = body.refresh_token;
			const uri = process.env.FRONTEND_URI || 'http://localhost:3000/';

			res.redirect(uri + '?access_token=' + access_token + '&refresh_token=' + refresh_token);
		});
	});
}

module.exports = function(app) {
	return new routes(app);
};
