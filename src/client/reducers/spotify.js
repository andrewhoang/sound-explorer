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

export const playlists = (state = initialState.playlists, action = null) => {
	switch (action.type) {
		case types.RECEIVE_PLAYLISTS:
			return action.playlists;
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
			return Object.assign({}, state, { isLoading: true, error: false });
		case types.RECEIVE_SEARCH_RESULTS:
			return action.results;
		default:
			return state;
	}
};

export const player = (state = initialState.player, action = null) => {
	switch (action.type) {
		case types.GET_PLAYER_SUCCESS:
			return Object.assign({}, state, {
				error: false,
				playing: action.player.is_playing,
				track: action.player.item,
				progress_ms: action.player.progress_ms,
			});
		case types.PLAY_TRACK_SUCCESS:
			return Object.assign({}, state, {
				error: false,
				playing: true,
				track: action.track,
				progress_ms: action.progress_ms,
			});
		case types.PLAY_TRACK_ERROR:
			return Object.assign({}, state, { error: { status: true } });
		case types.PAUSE_TRACK_SUCCESS:
			return Object.assign({}, state, { error: false, playing: false, progress_ms: action.progress_ms });
		case types.SEEK_TRACK_SUCCESS:
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

export const alert = (state = initialState.alert, action = null) => {
	switch (action.type) {
		case types.SHOW_ALERT_SUCCESS:
			return Object.assign(
				{},
				{
					title: action.alert.title,
					message: action.alert.message,
					link: action.alert.link,
					status: action.alert.status,
				}
			);
		case types.HIDE_ALERT_SUCCESS:
			return {};
		default:
			return state;
	}
};
