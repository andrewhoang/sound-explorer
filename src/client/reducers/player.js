import * as types from '../constants/ActionTypes';
import initialState from './initialState';

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
