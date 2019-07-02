import React, { Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faPauseCircle } from '@fortawesome/free-regular-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import ReactTooltip from 'react-tooltip';

import minBy from 'lodash/minBy';
import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';
import isEmpty from 'lodash/isEmpty';

class NewReleasesList extends Component {
	constructor(props) {
		super(props);
		this.state = { album: '' };
	}

	render() {
		let { albums, playing, track, isPremium } = this.props;

		return (
			<>
				<h2>
					New Releases
					<a data-tip data-for="info" className="info-tooltip">
						<FontAwesomeIcon icon={faInfoCircle} />
					</a>
				</h2>
				<ReactTooltip id="info" place="top">
					<p>Based on artists you follow.</p>
				</ReactTooltip>
				{!isEmpty(albums) ? (
					<div className="list">
						{uniqBy(orderBy(albums, 'release_date', 'desc'), 'name').map((album, i) => {
							const premiumProps = isPremium && {
								onMouseEnter: () => this.setState({ album: album.id }),
								onMouseLeave: () => this.setState({ album: '' }),
							};

							return (
								<div key={i} className="item-container animated fadeInUp">
									<div className="album-container" {...premiumProps}>
										{album.images && (
											<img
												src={minBy(album.images, 'height').url}
												className="display-pic"
												onClick={() => this.props.onClickPlay(album.uri, album.id)}
												style={{
													filter: this.state.album == album.id ? 'brightness(80%)' : '',
												}}
											/>
										)}
										{/* {(this.state.album == album.id || track == album.uri) && (
											<div className="actions">
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
										)} */}
									</div>
									<div className="card-detail">
										<h5>{album.name}</h5>
										<h6>
											{album.artists
												.map((artist, i) => (i == 0 ? artist.name : ` ${artist.name}`))
												.toString()}
										</h6>
									</div>
								</div>
							);
						})}
					</div>
				) : (
					<h3 className="vertical-center">No new releases</h3>
				)}
			</>
		);
	}
}

export default NewReleasesList;
