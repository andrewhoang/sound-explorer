const config = require('config');

class SpotifyController {
	authorize(req, res, next) {
		const url = `${config.spotify.baseUrl}/authorize?response_type=code&client_id=${
			config.spotify.clientId
		}&&redirect_uri=${encodeURIComponent(config.spotify.redirect_uri)}`;
		console.log('url', url);
	}

	getToken(req, res, next) {
		const url = `${
			config.baseUrl
		}token?grant_type=authorization_code&code=code"&redirect_uri=https://localhost:3000&client_secret=mysecret&client_id=${
			config.spotify.clientId
		}`;
		console.log('url', url);
	}
}

export default new SpotifyController();
