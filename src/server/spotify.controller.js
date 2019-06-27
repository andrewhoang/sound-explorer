const config = require('config');
const request = require('request');

class SpotifyController {
	refreshToken(req, res, next) {
		const url = `${config.spotify.baseUrl}/token`;
		const refresh_token = req.body.refresh_token;

		let authOptions = {
			url,
			form: {
				grant_type: 'refresh_token',
				refresh_token,
			},
			headers: {
				Authorization:
					'Basic ' +
					Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString(
						'base64'
					),
			},
			json: true,
		};

		request.post(authOptions, (error, response, body) => {
			res.status(200).json(body);
		});
	}
}

export default new SpotifyController();
