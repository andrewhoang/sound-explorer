import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import * as spotifyActions from '../../actions/spotifyActions';
import * as modalActions from '../../actions/modalActions';

import PlaylistHeader from './PlaylistHeader';
import UserPlaylists from './UserPlaylists';
import Modal from '../common/Modal';
import TrackList from './TrackList';
import MobileTrackList from './MobileTrackList';
import { Notification } from 'react-notification';

import findIndex from 'lodash/findIndex';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import shuffle from 'lodash/shuffle';
import uniqBy from 'lodash/uniqBy';

class Playlist extends Component {
	constructor(props) {
		super(props);
		this.state = {
			playlist: [],
			playing: false,
			uri: '',
			title: 'Playlist',
			isPublic: 'false',
			progress_ms: 0,
			error: false,
		};
	}

	componentDidMount = () => {
		if (!isEmpty(this.props.tracks)) {
			let tracks = uniqBy(this.props.tracks.reduce((prev, curr) => prev.concat(curr)), 'name', 'artist');
			let playlist = shuffle(tracks).slice(0, 20);
			if (!isEmpty(this.props.track)) {
				playlist.unshift(this.props.track);
			}
			this.setState({ tracks, playlist });
		} else {
			this.props.history.push('/');
		}
	};

	componentWillReceiveProps = nextProps => {
		if (nextProps.player !== this.props.player) {
			this.setState({ progress_ms: nextProps.player.progress_ms });
		}
	};

	componentWillUnmount = () => {
		this.props.actions.clearTracks();
	};

	handleNamePlaylist = e => {
		let title = e.target.innerHTML;
		this.setState({ title });
	};

	handleChangeStatus = (e, { value }) => {
		this.setState({ isPublic: value });
	};

	handleRemove = id => {
		let tracks = this.state.tracks;
		let playlist = this.state.playlist;

		let trackIdx = findIndex(playlist, { id: id });
		let newTrack = shuffle(tracks).slice(0, 1);

		playlist[trackIdx] = newTrack[0];

		this.setState({ tracks, playlist });
	};

	handlePlay = (track, id) => {
		let progress_ms = track == this.state.track ? this.state.progress_ms : 0;
		this.setState({ playing: true, track });
		this.props.playTrack(track, id, progress_ms);
	};

	handlePause = track => {
		this.setState({ playing: false, track });
		this.props.pauseTrack();
	};

	handleMove = (direction, id) => {
		let playlist = this.state.playlist;

		let trackIdx = findIndex(playlist, { id: id });
		let track = find(playlist, { id: id });

		playlist.splice(trackIdx, 1);
		if (direction == 'up') {
			playlist.splice(trackIdx - 1, 0, track);
		} else if (direction == 'down') {
			playlist.splice(trackIdx + 1, 0, track);
		}

		this.setState({ playlist });
	};

	handleCreate = () => {
		let { title, isPublic, playlist, base64 } = this.state;
		this.props.actions.savePlaylist(title, isPublic, playlist, base64);
	};

	// Display user's existing Spotify's playlists - updating
	onUpdatePlaylist = async () => {
		await this.props.actions.getPlaylists(this.props.user.id);
		await this.props.actions.showModal('savePlaylistModal');
	};

	// Add tracks to user's selected playlist
	handleUpdate = async id => {
		let { playlist, base64 } = this.state;
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

		let trackIdx = findIndex(playlist, { id: addingTrack.id });

		let newTrack = shuffle(tracks).slice(0, 1);

		playlist[trackIdx] = newTrack[0];

		this.setState({ tracks, playlist });
	};

	handleUploadImage = () => {
		this.refs.upload.click();
	};

	getBase64 = file => {
		return new Promise((resolve, reject) => {
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = error => reject(error);
		});
	};

	handleChangeImage = e => {
		let file = e.target.files[0];
		if (file.size <= 256000) {
			this.getBase64(file).then(data => {
				this.setState({ upload: URL.createObjectURL(file), base64: data, error: false });
			});
		} else {
			this.setState({ error: true });
		}
	};

	render = () => {
		let { player, playlists, playerOpen } = this.props;
		let { playlist, playing, track, upload, single } = this.state;

		let modalBody = (
			<UserPlaylists playlists={playlists} onClickUpdate={!single ? this.handleUpdate : this.handleAdd} />
		);

		let playlistProps = {
			playlist: playlist,
			track: track,
			playing: playing,
			onClickPlay: this.handlePlay,
			onClickPause: this.handlePause,
			onClickAdd: this.onAddTrack,
			onClickRemove: this.handleRemove,
			onClickMove: this.handleMove,
		};

		return (
			<div>
				{this.state.error && (
					<Notification
						isActive={this.state.error}
						title={'File is too large!'}
						message={'Please upload file no larger than 256 KB.'}
					/>
				)}
				<div className="container" style={{ paddingBottom: playerOpen ? '50px' : '20px' }}>
					<input ref="upload" type="file" onChange={e => this.handleChangeImage(e)} />
					<PlaylistHeader
						playlist={playlist}
						owner={this.props.user.display_name}
						isPublic={this.state.isPublic}
						onNamePlaylist={this.handleNamePlaylist}
						onChangeStatus={this.handleChangeStatus}
						onUploadImage={this.handleUploadImage}
						onSavePlaylist={this.handleCreate}
						onUpdatePlaylist={this.onUpdatePlaylist}
						upload={upload}
						savingPlaylist={this.props.savingPlaylist}
					/>
					<TrackList {...playlistProps} />
					<MobileTrackList {...playlistProps} />
					<Link
						to={'/'}
						className="pull-center"
						style={{ margin: '30px auto', textTransform: 'uppercase', fontWeight: 700 }}
					>
						Back to Home
					</Link>
				</div>
				<Modal
					id="savePlaylistModal"
					title="Add to Playlist"
					body={modalBody}
					modal={this.props.modal}
					close={this.props.actions.hideModal}
				/>
			</div>
		);
	};
}

Playlist.propTypes = {
	actions: PropTypes.object,
	tracks: PropTypes.array,
};

function mapStateToProps(state) {
	return {
		user: state.reducers.user,
		results: state.reducers.results,
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
