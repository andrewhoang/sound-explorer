import React from 'react';

import 'react-table/react-table.css';

import ReactTable from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faTrash, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import { Row, Col } from 'react-bootstrap';

const MobileTrackList = ({ playlist, playing, track, onClickPlay, onClickPause, onClickRemove, onClickMove }) => {
	return playlist.map(item => {
		const isPlaying = playing && track === item.uri;
		return (
			<Row
				className="track-list mobile"
				onClick={() =>
					!playing
						? onClickPlay(item.uri)
						: playing && track === item.uri
						? onClickPause(item.uri)
						: playing && track !== item.uri && onClickPlay(item.uri)
				}
			>
				<Col
					md={12}
					style={{
						color: isPlaying ? '#1db954' : '#fff',
						fontWeight: isPlaying ? 700 : 400,
					}}
				>
					<strong>{item.name}</strong>
					<p>
						{item.artists.map((artist, i) => (i == 0 ? `${artist.name}` : ` ${artist.name}`)).toString()} •{' '}
						{item.album.name}
					</p>
				</Col>
			</Row>
		);
	});
};

export default MobileTrackList;
