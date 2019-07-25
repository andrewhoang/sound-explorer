import * as types from '../constants/ActionTypes';
import initialState from './initialState';

export const playlists = (state = initialState.playlists, action = null) => {
	switch (action.type) {
		case types.RECEIVE_PLAYLISTS:
			return action.playlists;
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
