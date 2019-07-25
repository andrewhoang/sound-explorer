import * as types from '../constants/ActionTypes';
import initialState from './initialState';

export const alert = (state = initialState.alert, action = null) => {
	switch (action.type) {
		case types.SHOW_ALERT_SUCCESS:
			return Object.assign(
				{},
				{
					title: action.alert.title,
					message: action.alert.message,
					link: action.alert.link,
					status: action.alert.status,
				}
			);
		case types.HIDE_ALERT_SUCCESS:
			return {};
		default:
			return state;
	}
};
