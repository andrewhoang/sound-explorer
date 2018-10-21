import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import autoBind from 'react-autobind';

import { Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faEllipsisV, faPause, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlayCircle, faPauseCircle } from '@fortawesome/free-regular-svg-icons';

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
		let { albums, playing, track } = this.props;

		return (
			<Col md={12}>
				<h2>New Releases</h2>
				{albums &&
					uniqBy(orderBy(albums, 'release_date', 'desc'), 'name').map(album => {
						return (
							<Col
								md={length % 4 == 0 ? 3 : length % 3 == 0 ? 4 : 3}
								key={album}
								className="item-container"
							>
								<div
									className="album-container"
									onMouseEnter={() => this.setState({ album: album.id })}
									onMouseLeave={() => this.setState({ album: '' })}
								>
									{album.images && (
										<img
											src={maxBy(album.images, 'height').url}
											className="album-dp"
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
													onClick={() => this.props.onClickPlay(album.uri)}
												/>
											)}
											{playing &&
												track == album.uri && (
													<FontAwesomeIcon
														icon={faPauseCircle}
														onClick={() => this.props.onClickPause(album.uri)}
													/>
												)}
											{playing &&
												track !== album.uri && (
													<FontAwesomeIcon
														icon={faPlayCircle}
														onClick={() => this.props.onClickPlay(album.uri)}
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
					})}
			</Col>
		);
	}
}

export default NewReleasesList;