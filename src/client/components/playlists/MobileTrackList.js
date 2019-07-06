import React from 'react';

import 'react-table/react-table.css';

import ReactTable from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

import { Col } from 'react-bootstrap';
import minBy from 'lodash/minBy';

const MobileTrackList = ({ playlist, playing, track, onClickAdd, onClickPlay, onClickPause, onClickRemove }) => {
	return playlist.map((item, i) => {
		const isPlaying = playing && track === item.uri;
		return (
			<div key={i} className="track mobile animated fadeInUp">
				<Col
					xs={10}
					style={{
						color: isPlaying ? '#1db954' : '#fff',
						fontWeight: isPlaying ? 700 : 400,
					}}
					className="item-container"
					onClick={() =>
						!playing
							? onClickPlay(item.uri, item.id)
							: playing && track === item.uri
							? onClickPause(item.uri)
							: playing && track !== item.uri && onClickPlay(item.uri, item.id)
					}
				>
					<img src={minBy(item.album.images, 'height').url} className="display-pic" />
					<div className="card-detail">
						<strong>{item.name}</strong>
						<p>
							{item.artists
								.map((artist, i) => (i == 0 ? `${artist.name}` : ` ${artist.name}`))
								.toString()}{' '}
							• {item.album.name}
						</p>
					</div>
				</Col>
				<Col xs={2} className="actions">
					<FontAwesomeIcon icon={faPlus} onClick={() => onClickAdd(item.id)} />
					<FontAwesomeIcon icon={faTimes} onClick={() => onClickRemove(item.id)} />
				</Col>
			</div>
		);
	});
};

export default MobileTrackList;
