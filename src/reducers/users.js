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

export const image = (state = initialState.image, action) => {
	switch (action.type) {
		case types.GET_IMAGE_SUCCESS:
			return action.image;
		default:
			return state;
	}
};
