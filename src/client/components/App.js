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
import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForward, faBackward } from '@fortawesome/free-solid-svg-icons';

import querystring from 'query-string';
import isEmpty from 'lodash/isEmpty';
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

	tick = () => {
		let { player } = this.props;
		let timeLapsed = this.timeLapsed;

		this.setState({ time: timeLapsed });

		if (timeLapsed >= player.track.duration_ms) {
			this.setState({ time: 0 }, () => console.log('this.state.time', this.state.time));
			this.props.actions.pauseTrack();
			clearInterval(this.setTimer);
		}

		if (player.playing) {
			this.timeLapsed += 1000;
		}
	};

	pauseTrack = () => {
		this.props.actions.pauseTrack();
		clearInterval(this.setTimer);
	};

	playTrack = (track, id, progress_ms) => {
		clearInterval(this.setTimer);
		this.setTimer = setInterval(this.tick, 1000);
		console.log('progress_ms', progress_ms);
		this.props.actions.playTrack(track, id, progress_ms);

		this.timeLapsed = progress_ms || 0;
	};

	prevTrack = () => {};

	nextTrack = () => {};

	seekTrack = e => {
		let time = e.nativeEvent.offsetX;
		let length = this.player.clientWidth;

		let timeLapsed = parseInt((time / length) * this.props.player.track.duration_ms);
		this.setState({ time: timeLapsed });

		console.log('timeLapsed', timeLapsed);
		this.timeLapsed = timeLapsed;
		this.props.actions.seekTrack(timeLapsed);
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
					<Row className="audio-player">
						<Col md={1}>
							{/* <FontAwesomeIcon icon={faBackward} onClick={() => this.prevTrack()} /> */}
							{player.playing ? (
								<FontAwesomeIcon icon={faPause} onClick={() => this.pauseTrack()} />
							) : (
								<FontAwesomeIcon
									icon={faPlay}
									onClick={() =>
										this.playTrack(player.track.uri, player.track.id, player.progress_ms)
									}
								/>
							)}
							{/* <FontAwesomeIcon icon={faForward} onClick={e => this.nextTrack(e)} /> */}
						</Col>
						<Col md={11} style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '0 15px' }}>
							<p className="title">{player.track.name}</p>
							<div ref={e => (this.player = e)} className="track" onClick={this.seekTrack}>
								<div className="toggle" style={{ width: toggleWidth }} />
							</div>
							<p className="time">{`${moment(this.state.time).format('mm:ss')} | ${moment(
								player.track.duration_ms
							).format('mm:ss')}`}</p>
						</Col>
					</Row>
				)}
			</div>
		);
	}
}

App.propTypes = {
	actions: PropTypes.object,
	user: PropTypes.object,
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
