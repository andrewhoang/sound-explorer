import * as endpoints from './apiEndpoints';
import axios from 'axios';
import moment from 'moment';
import shuffle from 'lodash/shuffle';
import uniqBy from 'lodash/uniqBy';
import find from 'lodash/find';

class SpotifyService {
	static search(types, value) {
		let results = types.map(type => {
			const url = `${endpoints.SPOTIFY_BASE_URL}${endpoints.SEARCH}?q=${value}*&type=${type}&limit=10`;
			return axios.get(url).then(response => response.data);
		});

		return Promise.all(results);
	}

	static getArtist(id) {
		const url = `${endpoints.SPOTIFY_BASE_URL}${endpoints.ARTISTS}/${id}`;
		return axios.get(url).then(response => response.data);
	}

	static getRelatedArtists(id) {
		const url = `${endpoints.SPOTIFY_BASE_URL}${endpoints.ARTISTS}/${id}/related-artists`;
		return axios.get(url).then(response => response.data.artists);
	}

	static getTrack(id) {
		const url = `${endpoints.SPOTIFY_BASE_URL}${endpoints.TRACKS}/${id}`;
		return axios.get(url).then(response => response.data);
	}

	static getAlbum(id) {
		const url = `${endpoints.SPOTIFY_BASE_URL}${endpoints.ALBUMS}/${id}`;
		return axios.get(url).then(response => response.data);
	}

	static getAlbums(id) {
		const url = `${endpoints.SPOTIFY_BASE_URL}${endpoints.ARTISTS}/${id}/albums`;
		return axios.get(url).then(response => response.data);
	}

	static async getNewReleases(artists) {
		let albums = await artists.map(artist => {
			const url = `${endpoints.SPOTIFY_BASE_URL}${endpoints.ARTISTS}/${artist}/albums`;
			return axios.get(url).then(response => {
				let monthOld = moment().subtract(1, 'month');
				let recentAlbums = response.data.items
					.filter(album => moment(new Date(album.release_date)).isAfter(monthOld))
					.map(async album => {
						let isSaved = await this.checkIsSaved(album.uri);
						album.is_saved = isSaved;
						return album;
					});

				return Promise.all(recentAlbums);
			});
		});

		const results = await Promise.all(albums.map(p => p.catch(e => e)));
		const validResults = results.reduce((arr, curr) => {
			if (Array.isArray(curr) && curr.length) arr.push(...curr);
			return arr;
		}, []);

		return validResults;
	}

	static async getRecommendedTracks() {
		// Get last played tracks
		const lastPlayedUrl = `${endpoints.SPOTIFY_BASE_URL}/me${endpoints.PLAYER}/recently-played?limit=50`;
		const lastTracks = await axios.get(lastPlayedUrl).then(response => shuffle(response.data.items));

		let lastArtists = uniqBy(lastTracks.reduce((a, i) => a.concat(i.track.artists[0]), []), 'id').slice(0, 3);

		const trackIds = lastTracks.map(item => item.track.id).slice(0, 2);
		const artistIds = lastArtists.map(artist => artist.id);

		const params = `seed_tracks=${trackIds}&seed_artists=${artistIds}`;

		// Get recommendations based on last played tracks
		const recommendedUrl = `${endpoints.SPOTIFY_BASE_URL}/recommendations?limit=10&${params}`;

		return axios.get(recommendedUrl).then(response => {
			let tracks = response.data.tracks;
			return Promise.all(
				tracks.map(async track => {
					let isSaved = await this.checkIsSaved(track.uri);
					track.is_saved = isSaved;
					track.seed = lastArtists.map(artist => artist.name); // track seeded artists
					return track;
				})
			);
		});
	}

	/* LIBRARY */
	static addToLibrary(uri) {
		let type = uri.split(':')[1];
		let id = uri.split(':')[2];
		const url = `${endpoints.SPOTIFY_BASE_URL}/me/${type}s?ids=${id}`;
		return axios.put(url).then(response => response.data);
	}

	static checkIsSaved(uri) {
		let type = uri.split(':')[1];
		let id = uri.split(':')[2];
		const url = `${endpoints.SPOTIFY_BASE_URL}/me/${type}s/contains?ids=${id}`;
		return axios.get(url).then(response => response.data[0]);
	}

	/* PLAYLIST */
	static getPlaylists(id) {
		const url = `${endpoints.SPOTIFY_BASE_URL}${endpoints.USER}/${id}/playlists`;
		return axios.get(url).then(response => response.data.items);
	}

	static async createPlaylist(type, selection) {
		switch (type) {
			case 'artist':
				/* Get 50 tracks from each selected artists and return promise */
				let tracks = selection.map(artist => {
					const url = `${endpoints.SPOTIFY_BASE_URL}${endpoints.SEARCH}?q=artist:'${artist.name.replace(
						/ /g,
						'%20'
					)}'&type=track&market=US&limit=50`;
					return axios.get(url).then(response => {
						/* Response will include tracks with matching artist name, so filtering is needed */
						let filteredTracks = response.data.tracks.items.filter(track => {
							if (find(track.artists, { name: artist.name })) {
								return track;
							}
						});

						return filteredTracks;
					});
				});

				let allTracks = Promise.all(tracks);
				return allTracks;

			case 'track':
				const url = `${endpoints.SPOTIFY_BASE_URL}${endpoints.TRACKS}/${selection}`;
				let trackResponse = await axios.get(url);
				let track = trackResponse.data;
				/* * * * * * * * * * * * * * * * * * * * * */
				const featuresUrl = `${endpoints.SPOTIFY_BASE_URL}${endpoints.AUDIO_FEATURES}/${track.id}`;
				let featuresResponse = await axios.get(featuresUrl);
				let features = featuresResponse.data;
				/* * * * * * * * * * * * * * * * * * * * * */
				let artist = track.artists[0].id;
				const recommendedUrl = `${endpoints.SPOTIFY_BASE_URL}${
					endpoints.RECOMMENDATIONS
				}?market=US&limit=50&seed_artists=${artist}&seed_tracks=${track.id}&target_danceability=${
					features.danceability
				}&target_energy=${features.energy}`;
				return axios.get(recommendedUrl).then(response => [response.data.tracks]);
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

	/* PLAYER */
	static getPlayer() {
		const url = `${endpoints.SPOTIFY_BASE_URL}/me${endpoints.PLAYER}`;
		return axios.get(url).then(response => response.data);
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

	static prevTrack() {
		const url = `${endpoints.SPOTIFY_BASE_URL}/me${endpoints.PLAYER}/previous`;
		return axios.post(url).then(() => {
			const url = `${endpoints.SPOTIFY_BASE_URL}/me${endpoints.PLAYER}`;
			return axios.get(url).then(response => response.data);
		});
	}

	static nextTrack() {
		const url = `${endpoints.SPOTIFY_BASE_URL}/me${endpoints.PLAYER}/next`;
		return axios.post(url).then(() => {
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
