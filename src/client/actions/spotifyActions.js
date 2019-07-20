import * as types from '../constants/ActionTypes';
import { push } from 'react-router-redux';
import spotifyService from '../services/spotifyService';

function receiveArtist(artist) {
	return {
		type: types.RECEIVE_ARTIST,
		artist,
	};
}

function receiveArtists(artists) {
	return {
		type: types.RECEIVE_ARTISTS,
		artists,
	};
}

function receiveTrack(track) {
	return {
		type: types.RECEIVE_TRACK,
		track,
	};
}

function receiveTracks(tracks) {
	return {
		type: types.RECEIVE_TRACKS,
		tracks,
	};
}

function receiveAlbum(album) {
	return {
		type: types.RECEIVE_ALBUM,
		album,
	};
}

function receiveAlbums(albums) {
	return {
		type: types.RECEIVE_ALBUMS,
		albums,
	};
}

function receiveLastPlayed(tracks) {
	return {
		type: types.RECEIVE_LAST_PLAYED,
		tracks,
	};
}

function receiveRecommendedTracks(recommendedTracks) {
	return {
		type: types.RECEIVE_RECOMMENDED_TRACKS,
		recommendedTracks,
	};
}

function receivePlaylists(playlists) {
	return {
		type: types.RECEIVE_PLAYLISTS,
		playlists,
	};
}

export function clearTracks() {
	return {
		type: types.CLEAR_TRACKS,
	};
}

function requestSearch() {
	return {
		type: types.REQUEST_SEARCH,
	};
}

function receiveSearchResults(results) {
	return {
		type: types.RECEIVE_SEARCH_RESULTS,
		results,
	};
}

function playTrackSuccess(track, progress_ms) {
	return {
		type: types.PLAY_TRACK_SUCCESS,
		track,
		progress_ms,
	};
}

function pauseTrackSuccess(progress_ms) {
	return {
		type: types.PAUSE_TRACK_SUCCESS,
		progress_ms,
	};
}

function seekTrackSuccess(position_ms) {
	return {
		type: types.SEEK_TRACK_SUCCESS,
		progress_ms: position_ms,
	};
}

export function showAlert(title, message, link, status) {
	return {
		type: types.SHOW_ALERT_SUCCESS,
		alert: {
			title,
			message,
			link,
			status,
		},
	};
}

export function hideAlert() {
	return {
		type: types.HIDE_ALERT_SUCCESS,
		meta: {
			throttle: true,
		},
	};
}

export function playTrackError(error) {
	return {
		type: types.PLAY_TRACK_ERROR,
		error,
	};
}

function savingPlaylist(savingPlaylist = false) {
	return {
		type: types.SAVING_PLAYLIST,
		savingPlaylist,
	};
}

export function getArtist(id) {
	return dispatch =>
		spotifyService
			.getArtist(id)
			.then(response => dispatch(receiveArtist(response)))
			.catch(err => err);
}

export function getTrack(id) {
	return dispatch =>
		spotifyService
			.getTrack(id)
			.then(response => dispatch(receiveTrack(response)))
			.catch(err => err);
}

export function getAlbum(id) {
	return dispatch =>
		spotifyService
			.getAlbum(id)
			.then(response => dispatch(receiveAlbum(response)))
			.catch(err => console.error(err));
}

export function getAlbums(id) {
	return dispatch =>
		spotifyService
			.getAlbums(id)
			.then(response => dispatch(receiveAlbums(response)))
			.catch(err => console.error(err));
}

export function getRelatedArtists(id) {
	return dispatch =>
		spotifyService
			.getRelatedArtists(id)
			.then(response => dispatch(receiveArtists(response)))
			.catch(err => getRelatedArtists(id));
}

export function getNewReleases(artists) {
	return dispatch =>
		spotifyService
			.getNewReleases(artists)
			.then(response => dispatch(receiveAlbums(response)))
			.catch(err => console.error(err));
}

export function getRecommendedTracks() {
	return dispatch =>
		spotifyService
			.getRecommendedTracks()
			.then(response => dispatch(receiveRecommendedTracks(response)))
			.catch(err => console.error(err));
}

export function addToLibrary(uri) {
	return dispatch => {
		return spotifyService
			.addToLibrary(uri)
			.then(response => dispatch(showAlert('Track was successfully added to library', null, null, 'success')))
			.catch(err => err);
	};
}

export function getPlaylists(id) {
	return dispatch =>
		spotifyService
			.getPlaylists(id)
			.then(response => dispatch(receivePlaylists(response)))
			.catch(err => err);
}

export function createPlaylist(type, selection) {
	return dispatch => {
		dispatch(savingPlaylist(true));
		return spotifyService
			.createPlaylist(type, selection)
			.then(response => {
				dispatch(receiveTracks(response));
				dispatch(savingPlaylist());
				dispatch(push('/playlist'));
			})
			.catch(err => err);
	};
}

export function updatePlaylist(id, tracks, upload, REDIRECT = true) {
	return dispatch => {
		dispatch(savingPlaylist(true));
		return spotifyService
			.addToPlaylist(id, tracks)
			.then(() => {
				if (upload) {
					return spotifyService
						.addCoverImage(id, upload)
						.then(() => {
							dispatch(savingPlaylist());
							REDIRECT && dispatch(push('/'));
						})
						.catch(err => err);
				}
				dispatch(savingPlaylist());
				REDIRECT && dispatch(push('/'));
			})
			.catch(err => err);
	};
}

export function savePlaylist(title, isPublic, tracks, upload) {
	return dispatch => {
		dispatch(savingPlaylist(true));
		return spotifyService
			.savePlaylist(title, isPublic)
			.then(playlist => {
				spotifyService.addToPlaylist(playlist.id, tracks).then(() => {
					if (upload) {
						return spotifyService
							.addCoverImage(playlist.id, upload)
							.then(() => {
								dispatch(savingPlaylist());
								dispatch(push('/'));
							})
							.catch(err => err);
					}
					dispatch(savingPlaylist());
					dispatch(push('/'));
				});
			})
			.catch(err => err);
	};
}

export function addCoverImage(playlist, upload) {
	return dispatch =>
		spotifyService
			.addCoverImage(playlist, upload)
			.then(response => console.log(response))
			.catch(err => err);
}

export function playTrack(uri, id, progress_ms) {
	return dispatch =>
		spotifyService
			.playTrack(uri, id, progress_ms)
			.then(track => dispatch(playTrackSuccess(track, progress_ms)))
			.catch(err => {
				let title = '';
				let link = '';
				let message = '';
				switch (err.status) {
					case 404: // spotify not open
						title = 'Player not found';
						message = 'Click here to open up Spotify.';
						link = `spotify://${uri}`;
						break;
					case 403: // not premium
						title = 'Upgrade to Premium';
						message = 'Unable to access player for non-premium account.';
						break;
				}
				dispatch(showAlert(title, message, link, 'error'));
			});
}

export function pauseTrack(uri) {
	return dispatch =>
		spotifyService
			.pauseTrack(uri)
			.then(response => dispatch(pauseTrackSuccess(response.progress_ms)))
			.catch(err => err);
}

export function seekTrack(position_ms) {
	return dispatch =>
		spotifyService
			.seekTrack(position_ms)
			.then(response => {
				dispatch(seekTrackSuccess(position_ms));
			})
			.catch(err => err);
}

export function search(type, value) {
	return dispatch => {
		dispatch(requestSearch());
		return spotifyService
			.search(type, value)
			.then(response => dispatch(receiveSearchResults(response)))
			.catch(err => err);
	};
}
