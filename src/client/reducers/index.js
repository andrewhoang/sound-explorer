import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { track, tracks, recommendedTracks, album, albums, results } from './spotify';
import { artist, artists } from './artist';
import { playlists, savingPlaylist } from './playlist';
import { user } from './user';
import { player } from './player';
import { alert } from './alert';
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
	modal,
	alert,
	routing: routerReducer,
});

export default rootReducer;
