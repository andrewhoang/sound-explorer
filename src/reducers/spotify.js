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
		default:
			return state;
	}
};

export const artist = (state = initialState.artist, action = null) => {
	switch (action.type) {
		case types.RECEIVE_ARTIST:
			return action.artist;
		default:
			return state;
	}
};

export const artists = (state = initialState.artists, action = null) => {
	switch (action.type) {
		case types.RECEIVE_ARTISTS:
			return action.artists;
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
			return Object.assign({}, state, { isLoading: true, error: false });
		case types.RECEIVE_SEARCH_RESULTS:
			return action.results;
		default:
			return state;
	}
};

export const player = (state = initialState.player, action = null) => {
	switch (action.type) {
		case types.PLAY_TRACK_SUCCESS:
			return Object.assign({}, state, { error: false });
		case types.PLAY_TRACK_ERROR:
			return Object.assign({}, state, { error: true });
		case types.PAUSE_TRACK_SUCCESS:
			return Object.assign({}, state, { error: false, progress_ms: action.progress_ms });
		default:
			return state;
	}
};

export const savingPlaylist = (state = initialState.savingPlaylist, action = null) => {
	switch (action.type) {
		case types.SAVING_PLAYLIST:
			return action.savingPlaylist;
		default:
			return state;
	}
};
