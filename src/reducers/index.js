import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { artist, artists, track, tracks, albums, results, player } from './spotify';
import { user } from './users';

const rootReducer = combineReducers({
	artists,
	artist,
	albums,
	track,
	tracks,
	results,
	player,
	user,
	routing: routerReducer,
});

export default rootReducer;
