import axios from 'axios';
import * as endpoints from './apiEndpoints';

class UserService {
	static refreshToken(refresh_token) {
		const url = window.location.origin.includes('localhost')
			? `http://localhost:3000/api/token`
			: 'https://soundexplorer.herokuapp.com/api/token';
		let body = { refresh_token: refresh_token };

		return axios.post(url, body).then(response => {
			localStorage.setItem('access_token', response.data.access_token);
			localStorage.setItem('expires_in', response.data.expires_in);
			return response.data;
		});
	}

	static logOut() {
		localStorage.clear();
		window.location = window.location.origin;
	}

	static getUserProfile() {
		const url = `${endpoints.SPOTIFY_BASE_URL}${endpoints.GET_USER}`;
		return axios.get(url).then(user => {
			const url = `${endpoints.SPOTIFY_BASE_URL}${endpoints.GET_USER}/following?type=artist`;
			return axios.get(url).then(response => ({ ...user.data, following: response.data.artists.items }));
		});
	}
	static getHeroImage() {
		const url = `${endpoints.UNSPLASH_BASE_URL}/search${
			endpoints.GET_PHOTOS
		}?client_id=f08820019f6fd1e20d1404824387fa41ea67c5e425129a12fca0a03612055aa2&query=music`;

		return axios.get(url).then(response => {
			let images = response.data.results;
			let idx = Math.floor(Math.random() * images.length);
			return images[idx];
		});
	}
}

export default UserService;
