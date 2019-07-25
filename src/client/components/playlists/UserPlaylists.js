import React, { Component } from 'react';
import PropTypes from 'prop-types';

import List from '../styled/List';
import Card from '../styled/Card';

import isEmpty from 'lodash/isEmpty';

const UserPlaylist = ({ playlists, onClickUpdate }) => (
	<List className="-column">
		{playlists &&
			playlists.map(
				(playlist, i) =>
					!isEmpty(playlist.images) && (
						<Card
							key={i}
							className="-lg animated fadeInUp"
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
						</Card>
					)
			)}
	</List>
);

UserPlaylist.propTypes = {
	playlists: PropTypes.array,
	onClickUpdate: PropTypes.func,
};

export default UserPlaylist;
