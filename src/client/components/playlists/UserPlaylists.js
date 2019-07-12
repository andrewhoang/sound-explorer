import React, { Component } from 'react';

import { Row } from 'react-bootstrap';
import isEmpty from 'lodash/isEmpty';

class UserPlaylist extends Component {
	constructor(props) {
		super(props);
		this.state = { new: false };
	}

	render() {
		let { playlists, onClickUpdate } = this.props;

		return (
			<Row className="list -column">
				{playlists &&
					playlists.map(
						(playlist, i) =>
							!isEmpty(playlist.images) && (
								<div
									key={i}
									className="card -lg animated fadeInUp"
									style={{
										background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${
											playlist.images[0].url
										})`,
									}}
									onClick={() => onClickUpdate(playlist.id)}
								>
									<div className="card-detail">
										<h5>{playlist.name}</h5>
										<p>
											{playlist.tracks.total} {playlist.tracks.total !== 1 ? 'songs' : 'song'}
										</p>
									</div>
								</div>
							)
					)}
			</Row>
		);
	}
}
export default UserPlaylist;
