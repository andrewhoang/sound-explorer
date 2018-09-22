import * as types from '../constants/ActionTypes';
import musicService from '../services/musicService';

function requestSongs() {
	return {
		type: types.REQUEST_SONGS,
	};
}

function receiveSongs(data) {
	return {
		type: types.RECEIVE_SONGS,
		payload: {
			data,
		},
	};
}

export function authorize() {
	return dispatch => {
		return musicService
			.authorize()
			.then(function(response) {
				dispatch(receiveSongs(response.data));
			})
			.catch(function(response) {
				dispatch(receiveError(response.data));
			});
	};
}

export function getToken() {
	return dispatch => {
		return musicService
			.getToken()
			.then(function(response) {
				dispatch(receiveSongs(response.data));
			})
			.catch(function(response) {
				dispatch(receiveError(response.data));
			});
	};
}

export function loadSongs() {
	return dispatch => {
		dispatch(requestSongs());
		return musicService
			.loadSongs()
			.then(function(response) {
				dispatch(receiveSongs(response.data));
			})
			.catch(function(response) {
				dispatch(receiveError(response.data));
			});
	};
}
