import * as types from '../constants/ActionTypes';
import initialState from './initialState';

export const track = (state = initialState.track, action = null) => {
	switch (action.type) {
		case types.RECEIVE_TRACK:
			return action.track;
		default:
			return state;
	}
};

export const tracks = (state = initialState.tracks, action = null) => {
	switch (action.type) {
		case types.RECEIVE_TRACKS:
			return action.tracks;
		case types.CLEAR_TRACKS:
			return [];
		default:
			return state;
	}
};

export const recommendedTracks = (state = initialState.recommendedTracks, action = null) => {
	switch (action.type) {
		case types.RECEIVE_RECOMMENDED_TRACKS:
			return action.recommendedTracks;
		default:
			return state;
	}
};

export const album = (state = initialState.album, action = null) => {
	switch (action.type) {
		case types.RECEIVE_ALBUM:
			return action.album;
		default:
			return state;
	}
};

export const albums = (state = initialState.albums, action = null) => {
	switch (action.type) {
		case types.RECEIVE_ALBUMS:
			return action.albums;
		default:
			return state;
	}
};

export const results = (state = initialState.results, action) => {
	switch (action.type) {
		case types.REQUEST_SEARCH:
			return state;
		case types.RECEIVE_SEARCH_RESULTS:
			return action.results;
		default:
			return state;
	}
};
