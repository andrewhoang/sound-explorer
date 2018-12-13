import * as types from '../constants/ActionTypes';
import initialState from './initialState';

export const modal = (state = initialState.modal, action) => {
	switch (action.type) {
		case types.SHOW_MODAL_SUCCESS:
			return action.modal;

		case types.HIDE_MODAL_SUCCESS:
			return action.modal;

		default:
			return state;
	}
};
