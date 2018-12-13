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

		// let image = upload ? upload : playlist[0] && maxBy(playlist[0].album.images, 'height').url;

		return (
			<Row className="playlist-list">
				{playlists &&
					playlists.map(
						playlist =>
							!isEmpty(playlist.images) && (
								<Col
									md={length % 4 == 0 ? 3 : length % 3 == 0 ? 4 : 3}
									sm={6}
									key={playlist.id}
									className="item-container"
								>
									<img
										src={playlist.images[0].url}
										className="playlist-dp"
										onClick={() => onClickUpdate(playlist.id)}
									/>
									<h5>{playlist.name}</h5>
								</Col>
							)
					)}
			</Row>
		);
	}
}
export default UserPlaylist;
