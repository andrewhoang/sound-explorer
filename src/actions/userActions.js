import * as types from '../constants/ActionTypes';
import userService from '../services/userService';
import { push } from 'react-router-redux';

function getUserSuccess(user) {
	return {
		type: types.GET_USER_SUCCESS,
		user,
	};
}

function getHeroImageSuccess(image) {
	return {
		type: types.GET_IMAGE_SUCCESS,
		image,
	};
}

export function getUserProfile() {
	return dispatch => {
		return userService
			.getUserProfile()
			.then(response => dispatch(getUserSuccess(response)))
			.catch(err => console.error(err));
	};
}

export function getHeroImage() {
	return dispatch =>
		userService
			.getHeroImage()
			.then(response => dispatch(getHeroImageSuccess(response)))
			.catch(err => console.error(err));
}
