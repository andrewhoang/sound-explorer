import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Card from './common/Card';
import List from './styled/List';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartEmpty } from '@fortawesome/free-regular-svg-icons';

import minBy from 'lodash/minBy';
import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';

const NewReleasesList = ({
	playing,
	track,
	albums,
	isMobile,
	isPremium,
	user: { country },
	onClickPlay,
	onClickPause,
	onClickLike,
	showError,
}) => {
	const [state, setState] = useState({ itemsToShow: albums.length });
	const { itemsToShow, expanded } = state;

	useEffect(() => {
		!isMobile
			? setState(prevState => ({ ...prevState, itemsToShow: albums.length }))
			: setState(prevState => ({ ...prevState, itemsToShow: 5 }));
	}, [isMobile]);

	// useEffect(() => {
	// 	setState(prevState => ({ ...prevState, itemsToShow: albums.length }));
	// }, [albums]);

	const togglePlayer = album => {
		if (isPremium) {
			(playing && track !== album.uri) || !playing
				? onClickPlay(album.uri, album.id)
				: playing && track == album.uri
				? onClickPause(album.uri)
				: null;
		}
	};

	/* Mobile Only */
	const toggleShow = () => {
		itemsToShow === 5
			? setState(prevState => ({ ...prevState, itemsToShow: albums.length, expanded: true }))
			: setState(prevState => ({ ...prevState, itemsToShow: 5, expanded: false }));
	};

	const handleLike = uri => {
		setState(prevState => ({ ...prevState, [uri]: true }));
		onClickLike(uri);
	};

	const getAlbumInfo = album => {
		const isPlaying = playing && track == album.uri;
		const isAvailable = album.available_markets.includes(country);
		const isSaved = state[album.uri] || album.is_saved;
		return { isPlaying, isSaved, isAvailable };
	};

	const renderItems = () =>
		uniqBy(orderBy(albums, 'release_date', 'desc'), 'name')
			.slice(0, itemsToShow)
			.map(album => {
				const { isPlaying, isAvailable, isSaved } = getAlbumInfo(album);
				return (
					<Card
						key={album.id}
						image={minBy(album.images, 'height').url}
						style={{ color: isPlaying ? '#1db954' : 'white' }}
						title={album.name}
						subtext={album.artists.map(artist => artist.name).join(', ')}
						onClickCard={() => {
							isAvailable
								? togglePlayer(album)
								: showError('error', 'This track is currently unavailable in your country.');
						}}
						actions={
							<FontAwesomeIcon
								icon={isSaved ? faHeart : faHeartEmpty}
								onClick={() =>
									isSaved
										? showError('error', 'This album is already saved in your library.')
										: isAvailable
										? handleLike(album.uri)
										: showError('error', 'This album is currently unavailable in your country.')
								}
							/>
						}
					/>
				);
			});

	return (
		<div id="new-releases">
			<div className="heading">
				<h2 className="flex">New Releases</h2>
				<p>Based on artists you follow</p>
			</div>
			{albums.length ? (
				<List>
					{renderItems()}
					{isMobile && (
						<p className="see-more" onClick={toggleShow}>
							{expanded ? 'See less' : 'See more'}
						</p>
					)}
				</List>
			) : (
				<h3 className="vertical-center">No new releases</h3>
			)}
		</div>
	);
};

NewReleasesList.propTypes = {
	playing: PropTypes.bool,
	track: PropTypes.string,
	albums: PropTypes.array,
	isMobile: PropTypes.bool,
	isPremium: PropTypes.bool,
	user: PropTypes.object,
	onClickPlay: PropTypes.func,
	onClickPause: PropTypes.func,
	onClickLike: PropTypes.func,
	showError: PropTypes.func,
};

export default NewReleasesList;
