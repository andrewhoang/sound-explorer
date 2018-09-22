import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import songs from './songs';

const rootReducer = combineReducers({
	songs,
	routing: routerReducer,
});

export default rootReducer;
