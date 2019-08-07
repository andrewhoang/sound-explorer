import * as types from '../constants/ActionTypes';
import userService from '../services/userService';

const getUserSuccess = user => ({
	type: types.USER_SUCCESS,
	user,
});

export const getUserProfile = () => dispatch =>
	userService
		.getUserProfile()
		.then(response => dispatch(getUserSuccess(response)))
		.catch(err => console.error(err));
