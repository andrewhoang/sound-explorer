import axios from 'axios';
import moment from 'moment';
import shuffle from 'lodash/shuffle';
import * as endpoints from './apiEndpoints';

class SpotifyService {
	static search(types, value) {
		let responses = types.map(type => {
			const url = `${endpoints.SPOTIFY_BASE_URL}${endpoints.SEARCH}?q=${value}*&type=${type}&limit=10`;
			return axios.get(url).then(response => response.data);
		});

		let responsePromise = Promise.all(responses);
		return responsePromise;
	}

	static getArtist(id) {
		const url = `${endpoints.SPOTIFY_BASE_URL}${endpoints.GET_ARTIST}/${id}`;
		return axios.get(url).then(response => response.data);
	}

	static getRelatedArtists(id) {
		const url = `${endpoints.SPOTIFY_BASE_URL}${endpoints.GET_ARTIST}/${id}/related-artists`;
		return axios.get(url).then(response => response.data);
	}

	static getTrack(id) {
		const url = `${endpoints.SPOTIFY_BASE_URL}${endpoints.GET_TRACK}/${id}`;
		return axios.get(url).then(response => response.data);
	}

	static getAlbum(id) {
		const url = `${endpoints.SPOTIFY_BASE_URL}${endpoints.GET_ALBUM}/${id}`;
		return axios.get(url).then(response => response.data);
	}

	static getAlbums(id) {
		const url = `${endpoints.SPOTIFY_BASE_URL}${endpoints.GET_ARTIST}/${id}/albums`;
		return axios.get(url).then(response => response.data);
	}

	static async getNewReleases(artists) {
		let albums = artists.map(artist => {
			const url = `${endpoints.SPOTIFY_BASE_URL}${endpoints.GET_ARTIST}/${artist}/albums`;
			return axios.get(url).then(response => {
				let monthOld = moment().subtract(1, 'month');
				let recentAlbums = response.data.items.filter(album =>
					moment(new Date(album.release_date)).isAfter(monthOld)
				);

				return recentAlbums;
			});
		});

		const results = await Promise.all(albums.map(p => p.catch(e => e)));
		const validResults = results.reduce((arr, curr) => {
			if (Array.isArray(curr) && curr.length) arr.push(...curr);
			return arr;
		}, []);

		return validResults;
	}

	static async getRecommendedTrack() {
		// Get last played tracks
		const lastPlayedUrl = `${endpoints.SPOTIFY_BASE_URL}/me${endpoints.PLAYER}/recently-played`;
		const lastTracks = await axios.get(lastPlayedUrl).then(response => response.data.items);

		let lastTrack = await shuffle(lastTracks)[0].track;

		const params = `seed_tracks=${lastTrack.id}&seed_artists=${lastTrack.artists.map(artist => artist.id)}`;

		const recommendedUrl = `${endpoints.SPOTIFY_BASE_URL}/recommendations?limit=1&${params}`;
		return axios.get(recommendedUrl).then(response => response.data.tracks[0]);
	}

	static getPlaylists(id) {
		const url = `${endpoints.SPOTIFY_BASE_URL}${endpoints.GET_USER}/${id}/playlists`;
		return axios.get(url).then(response => response.data.items);
	}

	static createPlaylist(type, selection) {
		switch (type) {
			case 'artist':
				let tracks = selection.map(artist => {
					const url = `${endpoints.SPOTIFY_BASE_URL}${endpoints.SEARCH}?q=${type}:${
						artist.name
					}&type=track&market=US&limit=50`;
					console.log(url);
					return axios.get(url).then(response => response.data.tracks.items);
				});

				let allTracks = Promise.all(tracks);
				return allTracks;
				break;
			case 'track':
				const url = `${endpoints.SPOTIFY_BASE_URL}${endpoints.GET_TRACK}/${selection}`;
				return axios.get(url).then(response => {
					let track = response.data;
					let artists = track.artists.map(artist => artist.id).toString();

					// let genres = track.artists.map(artist => artist)
					const url = `${endpoints.SPOTIFY_BASE_URL}${
						endpoints.GET_RECOMMENDATIONS
					}?market=US&limit=50&seed_artists=${artists}&seed_tracks=${track.id}`;
					return axios.get(url).then(response => [response.data.tracks]);
				});
				break;
		}
	}

	static savePlaylist(name, status) {
		const url = `${endpoints.SPOTIFY_BASE_URL}/me${endpoints.PLAYLISTS}`;
		const body = {
			name,
			public: status,
		};
		return axios.post(url, body).then(response => response.data);
	}

	static addToPlaylist(id, tracks) {
		const url = `${endpoints.SPOTIFY_BASE_URL}${endpoints.PLAYLISTS}/${id}/tracks`;
		let uris = tracks.map(track => track.uri);

		const body = {
			uris,
		};

		return axios.post(url, body).then(response => response.data);
	}

	static addCoverImage(id, image) {
		const url = `${endpoints.SPOTIFY_BASE_URL}${endpoints.PLAYLISTS}/${id}/images`;

		let body = image.split('base64,')[1];

		const config = {
			headers: {
				'Content-Type': 'image/jpeg',
			},
		};

		return axios.put(url, body, config).then(response => response.data);
	}

	static playTrack(uri, id, position_ms) {
		const url = `${endpoints.SPOTIFY_BASE_URL}/me${endpoints.PLAYER}/play`;
		const body = {
			position_ms: position_ms,
		};

		if (uri && uri.includes('album')) {
			body[`context_uri`] = uri;
			// contexturi ? (body[`context_uri`] = uri) : (body[`uris`] = [uri]);
			return this.getAlbum(id).then(album => axios.put(url, body).then(response => album.tracks.items[0]));
		} else {
			body[`uris`] = [uri];
			return this.getTrack(id).then(track => axios.put(url, body).then(response => track));
		}
	}

	static pauseTrack() {
		const url = `${endpoints.SPOTIFY_BASE_URL}/me${endpoints.PLAYER}/pause`;
		return axios.put(url).then(() => {
			const url = `${endpoints.SPOTIFY_BASE_URL}/me${endpoints.PLAYER}`;
			return axios.get(url).then(response => response.data);
		});
	}

	static seekTrack(position_ms) {
		const url = `${endpoints.SPOTIFY_BASE_URL}/me${endpoints.PLAYER}/seek?position_ms=${position_ms}`;
		return axios.put(url).then(() => {
			const url = `${endpoints.SPOTIFY_BASE_URL}/me${endpoints.PLAYER}`;
			return axios.get(url).then(response => response.data);
		});
	}
}

export default SpotifyService;
