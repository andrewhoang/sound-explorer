import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { artist, artists, track, tracks, albums, results, player, savingPlaylist } from './spotify';
import { user } from './users';

const rootReducer = combineReducers({
	artists,
	artist,
	albums,
	track,
	tracks,
	results,
	player,
	savingPlaylist,
	user,
	routing: routerReducer,
});

export default rootReducer;
