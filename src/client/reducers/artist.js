import * as types from '../constants/ActionTypes';
import initialState from './initialState';

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
