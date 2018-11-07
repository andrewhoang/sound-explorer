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

function receiveAlbums(albums) {
	return {
		type: types.RECEIVE_ALBUMS,
		albums,
	};
}

function playTrackSuccess() {
	return {
		type: types.PLAY_TRACK_SUCCESS,
	};
}

function pauseTrackSuccess(progress_ms) {
	return {
		type: types.PAUSE_TRACK_SUCCESS,
		progress_ms,
	};
}

function playTrackError(error) {
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
	return dispatch => {
		return spotifyService
			.getArtist(id)
			.then(response => {
				dispatch(receiveArtist(response));
			})
			.catch(err => err);
	};
}

export function getTrack(id) {
	return dispatch => {
		return spotifyService
			.getTrack(id)
			.then(response => {
				dispatch(receiveTrack(response));
			})
			.catch(err => err);
	};
}

export function getAlbums(id) {
	return dispatch => {
		return spotifyService
			.getAlbums(id)
			.then(response => dispatch(receiveAlbums(response)))
			.catch(err => console.error(err));
	};
}

export function getRelatedArtists(id) {
	return dispatch => {
		return spotifyService
			.getRelatedArtists(id)
			.then(response => {
				dispatch(receiveArtists(response));
			})
			.catch(err => getRelatedArtists(id));
	};
}

export function getNewReleases(artists) {
	return dispatch => {
		return spotifyService
			.getNewReleases(artists)
			.then(response => {
				dispatch(receiveAlbums(response));
			})
			.catch(err => console.error(err));
	};
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
	return dispatch => {
		return spotifyService
			.addCoverImage(playlist, upload)
			.then(response => console.log(response))
			.catch(err => err);
	};
}

export function playTrack(uri, progress_ms, contexturi = false) {
	return dispatch => {
		return spotifyService
			.playTrack(uri, progress_ms, contexturi)
			.then(() => {
				dispatch(playTrackSuccess());
			})
			.catch(err => {
				if (err.status == 404) {
					dispatch(playTrackError(404));
				}
				if (err.status == 403) {
					dispatch(playTrackError(403));
				}
			});
	};
}

export function pauseTrack(uri) {
	return dispatch => {
		return spotifyService
			.pauseTrack(uri)
			.then(response => dispatch(pauseTrackSuccess(response.progress_ms)))
			.catch(err => err);
	};
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
