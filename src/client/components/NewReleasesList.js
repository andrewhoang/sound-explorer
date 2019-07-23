import React, { Component } from 'react';

import Card from './common/Card';

import minBy from 'lodash/minBy';
import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';
import isEmpty from 'lodash/isEmpty';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartEmpty } from '@fortawesome/free-regular-svg-icons';

class NewReleasesList extends Component {
	state = { albums: [], itemsToShow: 5, expanded: false };

	componentDidMount = () => {
		this.setState({ albums: this.props.albums });
		!this.props.isMobile
			? this.setState({ itemsToShow: this.props.albums.length })
			: this.setState({ itemsToShow: 5, expanded: false });
	};

	componentWillReceiveProps = nextProps => {
		if (nextProps.isMobile !== this.props.isMobile) {
			!nextProps.isMobile
				? this.setState({ itemsToShow: this.props.albums.length })
				: this.setState({ itemsToShow: 5, expanded: false });
		}
	};

	toggle = album => {
		let { playing, track, isPremium } = this.props;
		if (isPremium) {
			playing && track !== album.uri
				? this.props.onClickPlay(album.uri, album.id)
				: playing && track == album.uri
				? this.props.onClickPause(album.uri)
				: !playing
				? this.props.onClickPlay(album.uri, album.id)
				: null;
		}
	};

	toggleShow = () => {
		this.state.itemsToShow === 5
			? this.setState({ itemsToShow: this.props.albums.length, expanded: true })
			: this.setState({ itemsToShow: 5, expanded: false });
	};

	checkAvailability = album => {
		let { country } = this.props.user;
		return album.available_markets.includes(country);
	};

	onClickLike = uri => {
		this.setState({ [uri]: true });
		this.props.onClickLike(uri);
	};

	render() {
		let { playing, track, isMobile } = this.props;
		let { albums, itemsToShow, expanded } = this.state;

		return (
			<div id="new-releases">
				<div className="heading">
					<h2 className="flex">New Releases</h2>
					<p>Based on artists you follow</p>
				</div>
				{!isEmpty(albums) ? (
					<div className="list">
						{uniqBy(orderBy(albums, 'release_date', 'desc'), 'name')
							.slice(0, itemsToShow)
							.map((album, i) => {
								const isPlaying = playing && track == album.uri;
								const isAvailable = this.checkAvailability(album);
								const isSaved = this.state[album.uri] || album.is_saved;

								return (
									<Card
										key={i}
										src={minBy(album.images, 'height').url}
										style={{ color: isPlaying ? '#1db954' : 'white' }}
										title={album.name}
										subtext={album.artists.map(artist => artist.name).join(', ')}
										onClickCard={() => {
											isAvailable
												? this.toggle(album)
												: this.props.showError(
														'error',
														'This track is currently unavailable in your country.'
												  );
										}}
										actions={
											<FontAwesomeIcon
												icon={isSaved ? faHeart : faHeartEmpty}
												onClick={() =>
													isSaved
														? this.props.showError(
																'error',
																'This album is already saved in your library.'
														  )
														: isAvailable
														? this.onClickLike(album.uri)
														: this.props.showError(
																'error',
																'This album is currently unavailable in your country.'
														  )
												}
											/>
										}
									/>
								);
							})}
						{isMobile && (
							<p className="see-more" onClick={this.toggleShow}>
								{expanded ? 'See less' : 'See more'}
							</p>
						)}
					</div>
				) : (
					<h3 className="vertical-center">No new releases</h3>
				)}
			</div>
		);
	}
}

export default NewReleasesList;

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
