import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import { Switch, withRouter } from 'react-router-dom';

import * as userActions from '../actions/userActions';
import * as spotifyActions from '../actions/spotifyActions';

import RouteComponent from './routes/Route';
import MainRoute from './routes/MainRoute';
import Login from './Login';
import AudioPlayer from './AudioPlayer';

import querystring from 'query-string';
import moment from 'moment';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { time: 0, isAuth: false };
		autoBind(this);
	}

	componentDidMount = () => {
		let params = querystring.parse(location.search);

		if (params.access_token && params.refresh_token) {
			localStorage.setItem('access_token', params.access_token);
			localStorage.setItem('refresh_token', params.refresh_token);
		}

		let isAuth = localStorage.getItem('access_token') && localStorage.getItem('refresh_token') ? true : false;
		this.setState({ isAuth });
	};

	// Simulate time remaining
	tick = () => {
		let { player } = this.props;
		let timeLapsed = this.timeLapsed;

		this.setState({ time: timeLapsed });

		if (timeLapsed >= player.track.duration_ms) {
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
		this.setTimer = setInterval(this.tick, 1000);
		this.props.actions.playTrack(track, id, progress_ms);

		this.timeLapsed = progress_ms || 0;
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

	render() {
		let { player } = this.props;
		let { isAuth } = this.state;

		let fraction = player && player.track && this.state.time / player.track.duration_ms;
		let toggleWidth = `${(fraction * 100).toFixed(4)}%`;

		return (
			<div>
				<Switch>
					{!isAuth && <RouteComponent exact path="/" component={Login} />}
					{isAuth && (
						<RouteComponent
							path="/"
							component={MainRoute}
							auth={isAuth}
							playTrack={this.playTrack}
							pauseTrack={this.pauseTrack}
						/>
					)}
				</Switch>
				{player && player.track && (
					<AudioPlayer
						player={player}
						pauseTrack={this.pauseTrack}
						playTrack={this.playTrack}
						time={this.displayTime()}
						toggleWidth={toggleWidth}
						seekTrack={this.seekTrack}
					/>
				)}
			</div>
		);
	}
}

App.propTypes = {
	actions: PropTypes.object,
	user: PropTypes.object,
	player: PropTypes.object,
};

function mapStateToProps(state) {
	return {
		state: state.reducers,
		player: state.reducers.player,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({ ...userActions, ...spotifyActions }, dispatch),
	};
}

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(App)
);
