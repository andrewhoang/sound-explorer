import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { artist, artists, track, tracks, playlists, album, albums, results, player, savingPlaylist } from './spotify';
import { user, image } from './users';
import { modal } from './modal';

const rootReducer = combineReducers({
	artists,
	artist,
	album,
	albums,
	track,
	tracks,
	results,
	player,
	playlists,
	savingPlaylist,
	user,
	image,
	modal,
	routing: routerReducer,
});

export default rootReducer;
