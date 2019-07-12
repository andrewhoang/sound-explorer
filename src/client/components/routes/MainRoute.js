import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Switch, withRouter } from 'react-router-dom';

import * as userActions from '../../actions/userActions';
import * as spotifyActions from '../../actions/spotifyActions';

import RouteComponent from './Route';
import Home from '../Home';
import ArtistsPage from '../artists/ArtistsPage';
import PlaylistPage from '../playlists/PlaylistPage';
import AudioPlayer from '../AudioPlayer';
import AlertMessage from '../common/Notification';

import windowSize from 'react-window-size';
import moment from 'moment';

class MainRoute extends Component {
	constructor(props) {
		super(props);
		this.state = { rendered: true, time: 0 };
	}

	componentDidMount = () => {
		this.props.actions.getUserProfile();
		setTimeout(() => this.setState({ rendered: true }), 3500);
	};

	// Simulate time remaining
	tick = (start = null) => {
		let { player } = this.props;
		let timeLapsed = this.timeLapsed;

		this.setState({ time: timeLapsed }, () => {
			if (start) {
				this.timeLapsed += 1000;
			}
		});

		if (timeLapsed >= player.track && player.track.duration_ms) {
			this.setState({ time: 0 });
			this.props.actions.pauseTrack();
			clearInterval(this.setTimer);
		}

		if (player.playing) {
			this.timeLapsed += 1000;
		}
	};

	playTrack = (track, id, progress_ms) => {
		clearInterval(this.setTimer);
		this.timeLapsed = progress_ms || 0;
		this.tick(1);
		this.setTimer = setInterval(this.tick, 1000);
		this.props.actions.playTrack(track, id, progress_ms);
	};

	pauseTrack = () => {
		this.props.actions.pauseTrack();
		clearInterval(this.setTimer);
	};

	// Allow user to skip around track
	seekTrack = (e, player) => {
		let time = e.nativeEvent.offsetX;
		let length = player.clientWidth;

		let timeLapsed = parseInt((time / length) * this.props.player.track.duration_ms);
		this.setState({ time: timeLapsed });

		this.timeLapsed = timeLapsed;
		this.props.actions.seekTrack(timeLapsed);
	};

	displayTime = () => {
		let time =
			this.props.player &&
			`${moment(this.state.time).format('mm:ss')} | ${moment(this.props.player.track.duration_ms).format(
				'mm:ss'
			)}`;

		return time;
	};

	render = () => {
		let { player, windowWidth } = this.props;

		let fraction = player && player.track && this.state.time / player.track.duration_ms;
		let toggleWidth = `${(fraction * 100).toFixed(4)}%`;

		let playerOpen = player && player.track;

		return (
			<>
				<AlertMessage />
				<Switch>
					<RouteComponent
						{...this.props}
						exact
						path="/"
						component={Home}
						playerOpen={playerOpen}
						pauseTrack={this.pauseTrack}
						playTrack={this.playTrack}
						isMobile={windowWidth < 769}
					/>
					<RouteComponent
						{...this.props}
						path="/playlist"
						playerOpen={playerOpen}
						component={PlaylistPage}
						pauseTrack={this.pauseTrack}
						playTrack={this.playTrack}
						isMobile={windowWidth < 769}
					/>
					<RouteComponent
						{...this.props}
						path="/search"
						playerOpen={playerOpen}
						component={ArtistsPage}
						pauseTrack={this.pauseTrack}
						playTrack={this.playTrack}
						isMobile={windowWidth < 769}
					/>
				</Switch>
				{player && player.track && (
					<AudioPlayer
						player={player}
						pauseTrack={this.pauseTrack}
						playTrack={this.playTrack}
						time={this.displayTime()}
						toggleWidth={toggleWidth}
						seekTrack={this.seekTrack}
						isMobile={windowWidth < 769}
					/>
				)}
			</>
		);
	};
}

MainRoute.propTypes = {
	user: PropTypes.object,
	actions: PropTypes.object,
	player: PropTypes.object,
};

function mapStateToProps(state) {
	return {
		user: state.reducers.user,
		player: state.reducers.player,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({ ...userActions, ...spotifyActions }, dispatch),
	};
}

export default windowSize(
	withRouter(
		connect(
			mapStateToProps,
			mapDispatchToProps
		)(MainRoute)
	)
);
