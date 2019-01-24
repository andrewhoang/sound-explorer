import React, { Component } from 'react';
import autoBind from 'react-autobind';

import { Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faPauseCircle } from '@fortawesome/free-regular-svg-icons';
import { faPlay, faPause, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import ReactTooltip from 'react-tooltip';

import maxBy from 'lodash/maxBy';
import orderBy from 'lodash/orderBy';
import uniqBy from 'lodash/uniqBy';

class NewReleasesList extends Component {
	constructor(props) {
		super(props);
		this.state = { album: '' };
		autoBind(this);
	}

	render() {
		let { albums, playing, track, isPremium } = this.props;

		return (
			<Col md={12}>
				<h2>
					New Releases
					<a data-tip data-for="info" className="info-tooltip">
						<FontAwesomeIcon icon={faInfoCircle} />
					</a>
				</h2>
				<ReactTooltip id="info" place="top">
					<p>Based on artists you follow.</p>
				</ReactTooltip>

				<div className="album-list">
					{albums ? (
						uniqBy(orderBy(albums, 'release_date', 'desc'), 'name').map(album => {
							const premiumProps = isPremium && {
								onMouseEnter: () => this.setState({ album: album.id }),
								onMouseLeave: () => this.setState({ album: '' }),
							};

							return (
								<Col
									md={length % 4 == 0 ? 3 : length % 3 == 0 ? 4 : 3}
									sm={6}
									key={album.id}
									className="item-container"
								>
									<div className="album-container" {...premiumProps}>
										{album.images && (
											<img
												src={maxBy(album.images, 'height').url}
												className="album-dp"
												onClick={() => this.props.onClickPlay(album.uri, album.id)}
												style={{
													filter: this.state.album == album.id ? 'brightness(80%)' : '',
												}}
											/>
										)}
										{(this.state.album == album.id || track == album.uri) && (
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
										)}
										<h5>{album.name}</h5>
									</div>
									<h6>
										{album.artists
											.map((artist, i) => (i == 0 ? artist.name : ` ${artist.name}`))
											.toString()}
									</h6>
								</Col>
							);
						})
					) : (
						<h3>No new releases</h3>
					)}
				</div>
			</Col>
		);
	}
}

export default NewReleasesList;
