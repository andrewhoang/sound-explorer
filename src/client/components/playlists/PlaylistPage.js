import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import * as spotifyActions from '../../actions/spotifyActions';
import * as modalActions from '../../actions/modalActions';

import Container from '../styled/Container';
import PlaylistHeader from './PlaylistHeader';
import UserPlaylists from './UserPlaylists';
import Modal from '../common/Modal';
import TrackList from './TrackList';
import MobileTrackList from './MobileTrackList';

import findIndex from 'lodash/findIndex';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import shuffle from 'lodash/shuffle';
import uniqBy from 'lodash/uniqBy';
import orderBy from 'lodash/orderBy';

const PLAYLIST_SIZE = 20;

class Playlist extends Component {
	state = {
		playlist: [],
		playing: false,
		uri: '',
		title: 'Playlist',
		isPublic: 'false',
		progress_ms: 0,
	};

	componentDidMount = () => {
		const { track, tracks } = this.props;
		if (!isEmpty(tracks)) {
			const uniqTracks = uniqBy(tracks.reduce((prev, curr) => prev.concat(curr)), 'name', 'artist');
			const playlist = shuffle(uniqTracks).slice(0, PLAYLIST_SIZE);
			if (!isEmpty(track)) {
				playlist.unshift(track);
			}
			this.setState({ tracks: uniqTracks, playlist });
		} else {
			this.props.history.push('/');
		}
	};

	componentWillReceiveProps = nextProps => {
		if (nextProps.player !== this.props.player) {
			this.setState({ playing: nextProps.player.playing, progress_ms: nextProps.player.progress_ms });
		}
	};

	componentWillUnmount = () => {
		this.props.actions.clearTracks();
	};

	handleNamePlaylist = e => {
		this.setState({ title: e.target.innerHTML });
	};

	handleChangeStatus = (e, { value }) => {
		this.setState({ isPublic: value });
	};

	handleRemove = id => {
		const { tracks, playlist } = this.state;

		const trackIdx = findIndex(playlist, { id: id });
		const newTrack = shuffle(tracks).slice(0, 1);

		playlist[trackIdx] = newTrack[0];

		this.setState({ tracks, playlist });
	};

	handlePlay = (track, id) => {
		const progress_ms = track == this.state.track ? this.state.progress_ms : 0;
		this.setState({ track });
		this.props.actions.playTrack(track, id, progress_ms);
	};

	handlePause = track => {
		this.setState({ track });
		this.props.actions.pauseTrack();
	};

	handleMove = (direction, id) => {
		const { playlist } = this.state;

		const trackIdx = findIndex(playlist, { id: id });
		const track = find(playlist, { id: id });

		playlist.splice(trackIdx, 1);
		if (direction == 'up') {
			playlist.splice(trackIdx - 1, 0, track);
		} else if (direction == 'down') {
			playlist.splice(trackIdx + 1, 0, track);
		}

		this.setState({ playlist });
	};

	handleCreate = () => {
		const { title, isPublic, playlist, base64 } = this.state;
		this.props.actions.savePlaylist(title, isPublic, playlist, base64);
	};

	// Display user's existing Spotify's playlists - updating
	onUpdatePlaylist = async () => {
		await this.props.actions.getPlaylists(this.props.user.id);
		await this.props.actions.showModal('savePlaylistModal');
	};

	// Add tracks to user's selected playlist
	handleUpdate = async id => {
		const { playlist, base64 } = this.state;
		await this.props.actions.updatePlaylist(id, playlist, base64);
		await this.props.actions.hideModal('savePlaylistModal');
	};

	// Display user's existing Spotify's playlists - adding
	onAddTrack = async track => {
		this.setState({ addingTrack: track, single: true });
		await this.props.actions.getPlaylists(this.props.user.id);
		await this.props.actions.showModal('savePlaylistModal');
	};

	// Add single track to user's selected playlist
	handleAdd = async id => {
		let { addingTrack, playlist, tracks, base64 } = this.state;

		await this.props.actions.updatePlaylist(id, [addingTrack], base64, false);
		await this.props.actions.hideModal('savePlaylistModal');

		const trackIdx = findIndex(playlist, { id: addingTrack.id });

		const newTrack = shuffle(tracks).slice(0, 1);

		playlist[trackIdx] = newTrack[0];

		this.setState({ tracks, playlist });
	};

	handleUploadImage = () => {
		this.refs.upload.click();
	};

	getBase64 = file => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = error => reject(error);
		});
	};

	handleSort = sorted => {
		let { playlist } = this.state;
		const direction = sorted[0].desc ? 'desc' : 'asc';
		playlist = orderBy(playlist, sorted[0].id, direction);
		this.setState({ playlist });
	};

	handleChangeImage = e => {
		const file = e.target.files[0];
		if (file.size <= 256000) {
			this.getBase64(file).then(data => {
				this.setState({ upload: URL.createObjectURL(file), base64: data });
			});
		} else {
			this.props.actions.showAlert('error', 'File is too large!', 'Please upload file no larger than 256 KB.');
		}
	};

	render = () => {
		const { playlists, savingPlaylist, player, user, isMobile } = this.props;
		const { playlist, playing, track, upload, single } = this.state;

		const modalBody = (
			<UserPlaylists playlists={playlists} onClickUpdate={!single ? this.handleUpdate : this.handleAdd} />
		);

		const playlistProps = {
			playlist: playlist,
			track: track,
			playing: playing,
			isPremium: user.product === 'premium',
			onClickPlay: this.handlePlay,
			onClickPause: this.handlePause,
			onClickAdd: this.onAddTrack,
			onClickRemove: this.handleRemove,
			onClickMove: this.handleMove,
			onSortChange: this.handleSort,
		};

		return (
			<Container className="animated fadeIn" player={player.track}>
				<input ref="upload" type="file" onChange={e => this.handleChangeImage(e)} />
				<PlaylistHeader
					playlist={playlist}
					owner={user.display_name}
					isPublic={this.state.isPublic}
					onNamePlaylist={this.handleNamePlaylist}
					onChangeStatus={this.handleChangeStatus}
					onUploadImage={this.handleUploadImage}
					onSavePlaylist={this.handleCreate}
					onUpdatePlaylist={this.onUpdatePlaylist}
					upload={upload}
					savingPlaylist={savingPlaylist}
				/>
				{!isMobile ? <TrackList {...playlistProps} /> : <MobileTrackList {...playlistProps} />}
				<Link
					to={'/'}
					className="pull-center"
					style={{ margin: '30px auto', textTransform: 'uppercase', fontWeight: 700 }}
				>
					Back to Home
				</Link>
				<Modal
					id="savePlaylistModal"
					title="Add to Playlist"
					body={modalBody}
					modal={this.props.modal}
					close={this.props.actions.hideModal}
				/>
			</Container>
		);
	};
}

Playlist.propTypes = {
	actions: PropTypes.object,
	user: PropTypes.object,
	track: PropTypes.object,
	tracks: PropTypes.array,
	playlists: PropTypes.array,
	player: PropTypes.object,
	savingPlaylist: PropTypes.bool,
	isMobile: PropTypes.bool,
};

function mapStateToProps(state) {
	return {
		user: state.reducers.user,
		track: state.reducers.track,
		tracks: state.reducers.tracks,
		playlists: state.reducers.playlists,
		player: state.reducers.player,
		savingPlaylist: state.reducers.savingPlaylist,
		modal: state.reducers.modal,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({ ...spotifyActions, ...modalActions }, dispatch),
	};
}

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Playlist)
);
