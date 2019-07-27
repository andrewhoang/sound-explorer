import React from 'react';
import PropTypes from 'prop-types';

import Card from '../common/Card';
import List from '../styled/List';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

import minBy from 'lodash/minBy';

const MobileTrackList = ({
	playlist,
	playing,
	track,
	isPremium,
	onClickPlay,
	onClickPause,
	onClickAdd,
	onClickRemove,
}) => (
	<List>
		{playlist.map((item, i) => {
			const isPlaying = playing && track === item.uri;
			return (
				<Card
					key={i}
					image={minBy(item.album.images, 'height').url}
					style={{
						color: isPlaying ? '#1db954' : '#fff',
						fontWeight: isPlaying ? 700 : 400,
					}}
					title={item.name}
					subtext={`${item.artists
						.map((artist, i) => (i == 0 ? `${artist.name}` : ` ${artist.name}`))
						.toString()} • ${item.album.name}`}
					onClickCard={() => {
						isPremium &&
							(!playing
								? onClickPlay(item.uri, item.id)
								: playing && track === item.uri
								? onClickPause(item.uri)
								: playing && track !== item.uri && onClickPlay(item.uri, item.id));
					}}
					actions={
						<>
							<FontAwesomeIcon icon={faPlus} onClick={() => onClickAdd(item)} />
							<FontAwesomeIcon icon={faTimes} onClick={() => onClickRemove(item.id)} />
						</>
					}
				/>
			);
		})}
	</List>
);

MobileTrackList.propTypes = {
	playlist: PropTypes.array,
	playing: PropTypes.bool,
	track: PropTypes.string,
	isPremium: PropTypes.boolean,
	onClickPlay: PropTypes.func,
	onClickPause: PropTypes.func,
	onClickAdd: PropTypes.func,
	onClickRemove: PropTypes.func,
};

export default MobileTrackList;
