import * as types from '../constants/ActionTypes';
import initialState from './initialState';

export default function songs(state = initialState.songs, action = null) {
	switch (action.type) {
		case types.RECEIVE_SONGS:
			return Object.assign({}, state, { isLoading: false, data: action.payload.data });
		case types.REQUEST_SONGS:
			return Object.assign({}, state, { isLoading: true, error: false });
		default:
			return state;
	}
}
