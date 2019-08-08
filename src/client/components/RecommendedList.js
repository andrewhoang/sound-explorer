import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartEmpty } from '@fortawesome/free-regular-svg-icons';

import Card from './common/Card';
import List from './styled/List';

import minBy from 'lodash/minBy';
import uniqBy from 'lodash/uniqBy';

const RecommendedList = ({
	playing,
	track,
	tracks,
	isPremium,
	onClickPlay,
	onClickPause,
	onClickLike,
	onClickRefresh,
	showError,
}) => {
	const [state, setState] = useState({});

	const handlePlayer = recommendedTrack => {
		if (isPremium) {
			playing && track !== recommendedTrack.uri
				? onClickPlay(recommendedTrack.uri, recommendedTrack.id)
				: playing && track == recommendedTrack.uri
				? onClickPause(recommendedTrack.uri)
				: !playing
				? onClickPlay(recommendedTrack.uri, recommendedTrack.id)
				: null;
		}
	};

	const handleLike = uri => {
		setState(prevState => ({ ...prevState, [uri]: true }));
		onClickLike(uri);
	};

	const getTrackInfo = recommendedTrack => {
		const isPlaying = playing && track == recommendedTrack.uri;
		const isSaved = state[recommendedTrack.uri] || recommendedTrack.is_saved;
		return { isPlaying, isSaved };
	};

	const renderItems = () =>
		uniqBy(tracks, 'uri').map(track => {
			const { isPlaying, isSaved } = getTrackInfo(track);

			return (
				<Card
					key={track.id}
					image={minBy(track.album.images, 'height').url}
					style={{ color: isPlaying ? '#1db954' : 'white' }}
					title={track.name}
					subtext={track.artists.map(artist => artist.name).join(', ')}
					onClickCard={() => handlePlayer(track)}
					actions={
						<FontAwesomeIcon
							icon={isSaved ? faHeart : faHeartEmpty}
							onClick={() =>
								isSaved
									? showError('error', 'This track is already saved in your library.')
									: handleLike(track.uri)
							}
						/>
					}
				/>
			);
		});

	const listenedArtists = tracks[0] && tracks[0].seed.join(', ');

	return (
		<div id="recommended">
			<div className="heading flex">
				<span>
					<h2>Recommended for You</h2>
					{listenedArtists && <p>Because you listened to {listenedArtists}</p>}
				</span>
				<FontAwesomeIcon icon={faSyncAlt} onClick={onClickRefresh} />
			</div>
			{tracks.length ? <List>{renderItems()}</List> : <h3 className="vertical-center">No recommended tracks</h3>}
		</div>
	);
};

RecommendedList.propTypes = {
	playing: PropTypes.bool,
	track: PropTypes.string,
	tracks: PropTypes.array,
	isPremium: PropTypes.bool,
	user: PropTypes.object,
	onClickPlay: PropTypes.func,
	onClickPause: PropTypes.func,
	onClickLike: PropTypes.func,
	showError: PropTypes.func,
};

export default RecommendedList;
