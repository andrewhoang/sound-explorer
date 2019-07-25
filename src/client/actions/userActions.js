import * as types from '../constants/ActionTypes';
import userService from '../services/userService';
import { push } from 'react-router-redux';

function getUserSuccess(user) {
	return {
		type: types.USER_SUCCESS,
		user,
	};
}

export function getUserProfile() {
	return dispatch =>
		userService
			.getUserProfile()
			.then(response => dispatch(getUserSuccess(response)))
			.catch(err => console.error(err));
}
