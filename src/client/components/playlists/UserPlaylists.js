import React, { Component } from 'react';
import autoBind from 'react-autobind';

import { Row, Col, Button } from 'react-bootstrap';
import { Form, Radio } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import maxBy from 'lodash/maxBy';
import isEmpty from 'lodash/isEmpty';

class UserPlaylist extends Component {
	constructor(props) {
		super(props);
		this.state = { new: false };
		autoBind(this);
	}

	render() {
		let { playlists, onClickUpdate } = this.props;

		return (
			<Row className="list -column">
				{playlists &&
					playlists.map(
						playlist =>
							!isEmpty(playlist.images) && (
								<div
									key={playlist.id}
									className="item-container -lg"
									style={{
										background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${
											playlist.images[0].url
										})`,
									}}
									onClick={() => onClickUpdate(playlist.id)}
								>
									<div className="card-detail">
										<h5>{playlist.name}</h5>
										<h6>
											{playlist.tracks.total} {playlist.tracks.total !== 1 ? 'songs' : 'song'}
										</h6>
									</div>
								</div>
							)
					)}
			</Row>
		);
	}
}
export default UserPlaylist;
