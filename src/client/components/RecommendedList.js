import React, { Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faPauseCircle } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import Card from './common/Card';

import minBy from 'lodash/minBy';
import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';
import isEmpty from 'lodash/isEmpty';

class RecommendedList extends Component {
	handlePlayer = recommendedTrack => {
		let { playing, track, isPremium } = this.props;
		if (isPremium) {
			playing && track !== recommendedTrack.uri
				? this.props.onClickPlay(recommendedTrack.uri, recommendedTrack.id)
				: playing && track == recommendedTrack.uri
				? this.props.onClickPause(recommendedTrack.uri)
				: !playing
				? this.props.onClickPlay(recommendedTrack.uri, recommendedTrack.id)
				: null;
		}
	};

	render() {
		let { playing, track, tracks } = this.props;
		let listenedArtists = tracks[0].seed.join(', ');
		return (
			<div id="recommended">
				<div className="heading">
					<h2 className="flex">Recommended for You</h2>
					<p>Because you listened to {listenedArtists}</p>
				</div>
				{!isEmpty(tracks) ? (
					<div className="list">
						{uniqBy(orderBy(tracks, 'release_date', 'desc'), 'name').map((recommendedTrack, i) => {
							const isPlaying = playing && track == recommendedTrack.album.uri;
							return (
								<Card
									key={i}
									onClickCard={() => this.handlePlayer(recommendedTrack)}
									src={minBy(recommendedTrack.album.images, 'height').url}
									style={{ color: isPlaying ? '#1db954' : 'white' }}
									title={recommendedTrack.name}
									subtext={recommendedTrack.artists.map(artist => artist.name).join(', ')}
									actions={
										<FontAwesomeIcon
											icon={faHeart}
											onClick={() => this.props.onClickLike(recommendedTrack.uri)}
										/>
									}
								/>
							);
						})}
					</div>
				) : (
					<h3 className="vertical-center">No new releases</h3>
				)}
			</div>
		);
	}
}

export default RecommendedList;

{
	/* {(this.state.album == album.id || track == album.uri) && (
											<div className="album-actions">
												{!playing && (
													<FontAwesomeIcon
														icon={faPlayCircle}
														onClick={() => this.props.onClickPlay(album.uri, album.id)}
													/>
												)}
												{playing && track == album.uri && (
													<FontAwesomeIcon
														icon={faPauseCircle}
														onClick={() => this.props.onClickPause(album.uri)}
													/>
												)}
												{playing && track !== album.uri && (
													<FontAwesomeIcon
														icon={faPlayCircle}
														onClick={() => this.props.onClickPlay(album.uri, album.id)}
													/>
												)}
											</div>
										)} */
}
