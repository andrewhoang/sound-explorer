import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForward, faBackward } from '@fortawesome/free-solid-svg-icons';

class AudioPlayer extends Component {
	render() {
		let { player, pauseTrack, playTrack, time, seekTrack, toggleWidth } = this.props;

		return (
			<div className="player-container">
				<Row className="audio-player">
					<Col md={1} xs={1} className="controls">
						{player.playing ? (
							<FontAwesomeIcon icon={faPause} onClick={pauseTrack} />
						) : (
							<FontAwesomeIcon
								icon={faPlay}
								onClick={() => playTrack(player.track.uri, player.track.id, player.progress_ms)}
							/>
						)}
					</Col>
					<Col md={11} xs={8} className="audio-bar">
						<p className="title">{player.track.name}</p>
						<div className="track-container">
							<div
								ref={p => (this.player = p)}
								className="track"
								onClick={e => seekTrack(e, this.player)}
							>
								<div className="toggle" style={{ width: toggleWidth }} />
							</div>
						</div>
						<p className="time">{time}</p>
					</Col>
				</Row>
			</div>
		);
	}
}

export default AudioPlayer;
