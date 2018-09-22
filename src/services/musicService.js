import axios from 'axios';
import * as endpoints from './apiEndpoints';

class MusicService {
	static authorize() {
		const url = `${endpoints.BASE_URL}${endpoints.AUTHORIZE}`;
		axios.get(url).then(response => response.data);
	}
	static getToken() {
		const url = `${endpoints.BASE_URL}${endpoints.GET_TOKEN}`;
		axios.get(url).then(response => response.data);
	}

	static loadSongs() {
		const url = '';
		console.log('hello');
		axios.get(url).then(response => response.data);
	}
}

export default MusicService;
