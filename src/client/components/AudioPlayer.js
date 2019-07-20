import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as spotifyActions from '../actions/spotifyActions';

import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForward, faBackward } from '@fortawesome/free-solid-svg-icons';

import moment from 'moment';

class AudioPlayer extends Component {
	state = { time: 0 };

	componentWillReceiveProps = nextProps => {
		if (nextProps.player !== this.props.player) {
			if (nextProps.player.playing) {
				clearInterval(this.setTimer);
				this.timeLapsed = nextProps.player.progress_ms || 0;
				this.tick(1);
				this.setTimer = setInterval(this.tick, 1000);
			} else {
				clearInterval(this.setTimer);
			}
		}
	};

	// Simulate time remaining
	tick = (start = null) => {
		let { player } = this.props;
		let timeLapsed = this.timeLapsed;

		this.setState({ time: timeLapsed }, () => {
			if (start) this.timeLapsed += 1000;
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
		this.props.actions.playTrack(track, id, progress_ms);
	};

	pauseTrack = () => {
		this.props.actions.pauseTrack();
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
		const { player } = this.props;
		const { playing, track, progress_ms } = player;

		let fraction = player && player.track && this.state.time / player.track.duration_ms;
		let toggleWidth = `${(fraction * 100).toFixed(4)}%`;

		return player && player.track ? (
			<div className="player-container">
				<Row className="audio-player">
					<Col md={1} xs={1} className="controls">
						<FontAwesomeIcon
							icon={playing ? faPause : faPlay}
							onClick={playing ? this.pauseTrack : () => this.playTrack(track.uri, track.id, progress_ms)}
						/>
					</Col>
					<Col md={11} xs={8} className="audio-bar">
						<p className="title">{track.name}</p>
						<div className="track-container">
							<div
								ref={p => (this.player = p)}
								className="track"
								onClick={e => this.seekTrack(e, this.player)}
							>
								<div className="toggle" style={{ width: toggleWidth }} />
							</div>
						</div>
						<p className="time">{this.displayTime()}</p>
					</Col>
				</Row>
			</div>
		) : (
			<div />
		);
	}
}

function mapStateToProps(state) {
	return {
		player: state.reducers.player,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({ ...spotifyActions }, dispatch),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AudioPlayer);
