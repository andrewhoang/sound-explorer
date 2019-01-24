import React from 'react';

import 'react-table/react-table.css';

import ReactTable from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faTimes, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import { Row, Col } from 'react-bootstrap';

const MobileTrackList = ({ playlist, playing, track, onClickPlay, onClickPause, onClickRemove, onClickMove }) => {
	return playlist.map(item => {
		const isPlaying = playing && track === item.uri;
		return (
			<Row className="track-list mobile">
				<Col
					xs={10}
					style={{
						color: isPlaying ? '#1db954' : '#fff',
						fontWeight: isPlaying ? 700 : 400,
					}}
					onClick={() =>
						!playing
							? onClickPlay(item.uri, item.id)
							: playing && track === item.uri
							? onClickPause(item.uri)
							: playing && track !== item.uri && onClickPlay(item.uri, item.id)
					}
				>
					<strong>{item.name}</strong>
					<p>
						{item.artists.map((artist, i) => (i == 0 ? `${artist.name}` : ` ${artist.name}`)).toString()} •{' '}
						{item.album.name}
					</p>
				</Col>
				<Col xs={2}>
					<FontAwesomeIcon style={{ float: 'right' }} icon={faTimes} onClick={() => onClickRemove(item.id)} />
				</Col>
			</Row>
		);
	});
};

export default MobileTrackList;
