const config = require('config');
const request = require('request');

class SpotifyController {
	refreshToken(req, res, next) {
		const url = `${config.spotify.baseUrl}/token`;
		const refresh_token = req.body.refresh_token;
		const client_id = process.env.SPOTIFY_CLIENT_ID;
		const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

		const authOptions = {
			url,
			form: {
				grant_type: 'refresh_token',
				refresh_token,
			},
			headers: {
				Authorization: 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
			},
			json: true,
		};

		request.post(authOptions, (error, response, body) => {
			res.status(200).json(body);
		});
	}
}

module.exports = new SpotifyController();
