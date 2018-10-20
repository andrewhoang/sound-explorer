import * as types from '../constants/ActionTypes';
import userService from '../services/userService';

function getUserSuccess(user) {
	return {
		type: types.GET_USER_SUCCESS,
		user,
	};
}

export function getUserProfile() {
	return dispatch => {
		return userService
			.getUserProfile()
			.then(response => dispatch(getUserSuccess(response)))
			.catch(err => console.log('error', err));
	};
}
