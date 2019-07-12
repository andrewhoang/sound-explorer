import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import {
	artist,
	artists,
	track,
	tracks,
	recommendedTracks,
	playlists,
	album,
	albums,
	results,
	player,
	savingPlaylist,
	alert,
} from './spotify';
import { user, image } from './users';
import { modal } from './modal';

const rootReducer = combineReducers({
	artists,
	artist,
	album,
	albums,
	track,
	tracks,
	recommendedTracks,
	results,
	player,
	playlists,
	savingPlaylist,
	user,
	image,
	modal,
	alert,
	routing: routerReducer,
});

export default rootReducer;
