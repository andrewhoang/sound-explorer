import React from 'react';

import Card from '../common/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

import minBy from 'lodash/minBy';

const MobileTrackList = ({ playlist, playing, track, onClickAdd, onClickPlay, onClickPause, onClickRemove }) => {
	return (
		<div className="list">
			{playlist.map((item, i) => {
				const isPlaying = playing && track === item.uri;
				return (
					<Card
						key={i}
						src={minBy(item.album.images, 'height').url}
						style={{
							color: isPlaying ? '#1db954' : '#fff',
							fontWeight: isPlaying ? 700 : 400,
						}}
						title={item.name}
						subtext={`${item.artists
							.map((artist, i) => (i == 0 ? `${artist.name}` : ` ${artist.name}`))
							.toString()} • ${item.album.name}`}
						onClickCard={() => {
							!playing
								? onClickPlay(item.uri, item.id)
								: playing && track === item.uri
								? onClickPause(item.uri)
								: playing && track !== item.uri && onClickPlay(item.uri, item.id);
						}}
						actions={
							<>
								<FontAwesomeIcon icon={faPlus} onClick={() => onClickAdd(item.id)} />
								<FontAwesomeIcon icon={faTimes} onClick={() => onClickRemove(item.id)} />
							</>
						}
					/>
				);
			})}
		</div>
	);
};

export default MobileTrackList;
