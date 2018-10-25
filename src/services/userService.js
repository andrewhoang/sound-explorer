import axios from 'axios';
import * as endpoints from './apiEndpoints';
import queryString from 'query-string';

class UserService {
	static refreshToken(refresh_token) {
		const url = `http://localhost:3000/api/token`;
		let body = { refresh_token: refresh_token };
		return axios.post(url, body).then(response => {
			localStorage.setItem('access_token', response.data.access_token);
			localStorage.setItem('expires_in', response.data.expires_in);
			return response.data;
		});
	}

	static getUserProfile() {
		const url = `${endpoints.BASE_URL}${endpoints.GET_USER}`;
		return axios.get(url).then(user => {
			const url = `${endpoints.BASE_URL}${endpoints.GET_USER}/following?type=artist`;
			return axios.get(url).then(response => ({ ...user.data, following: response.data.artists.items }));
		});
	}
}

export default UserService;
