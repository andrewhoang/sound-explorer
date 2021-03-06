import * as types from '../constants/ActionTypes';
import initialState from './initialState';

export const user = (state = initialState.user, action) => {
	switch (action.type) {
		case types.GET_USER_SUCCESS:
			return action.user;
		default:
			return state;
	}
};
