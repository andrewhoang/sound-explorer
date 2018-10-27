import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import autoBind from 'react-autobind';

import * as spotifyActions from '../../actions/spotifyActions';

import PlaylistHeader from './PlaylistHeader';
import TrackList from './TrackList';
import { Notification } from 'react-notification';

import findIndex from 'lodash/findIndex';
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
		};
		autoBind(this);
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

		playlist.splice(trackIdx, 1);
		let newTrack = shuffle(tracks).slice(0, 1);
		playlist.push(...newTrack);

		this.setState({ tracks, playlist });
	};

	handlePlay = track => {
		let progress_ms = track == this.state.track ? this.state.progress_ms : 0;
		this.setState({ playing: true, track });
		this.props.actions.playTrack(track, progress_ms);
	};

	handlePause = track => {
		this.setState({ playing: false, track });
		this.props.actions.pauseTrack(track);
	};

	handleSave = () => {
		let { title, isPublic, playlist, base64 } = this.state;
		this.props.actions.savePlaylist(title, isPublic, playlist, base64);
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
		this.setState({ upload: URL.createObjectURL(e.target.files[0]) });
		this.getBase64(e.target.files[0]).then(data => {
			this.setState({ base64: data });
		});
	};

	render() {
		let { playlist, playing, track, upload } = this.state;
		return (
			<div>
				<Notification
					isActive={this.props.player.error}
					title={'Player not Found!'}
					message={'Please open up Spotify to continue.'}
				/>
				<div className="container">
					<input ref="upload" type="file" onChange={e => this.handleChangeImage(e)} />
					<PlaylistHeader
						playlist={playlist}
						onNamePlaylist={this.handleNamePlaylist}
						isPublic={this.state.isPublic}
						onChangeStatus={this.handleChangeStatus}
						onUploadImage={this.handleUploadImage}
						onSavePlaylist={this.handleSave}
						upload={upload}
						savingPlaylist={this.props.savingPlaylist}
					/>
					<TrackList
						playlist={playlist}
						track={track}
						playing={playing}
						onClickPlay={this.handlePlay}
						onClickPause={this.handlePause}
						onClickRemove={this.handleRemove}
					/>
				</div>
			</div>
		);
	}
}

Playlist.propTypes = {
	actions: PropTypes.object,
	tracks: PropTypes.array,
};

function mapStateToProps(state) {
	return {
		results: state.reducers.results,
		track: state.reducers.track,
		tracks: state.reducers.tracks,
		player: state.reducers.player,
		savingPlaylist: state.reducers.savingPlaylist,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({ ...spotifyActions }, dispatch),
	};
}

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Playlist)
);
