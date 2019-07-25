import React from 'react';
import PropTypes from 'prop-types';

import ReactTooltip from 'react-tooltip';

import minBy from 'lodash/minBy';

const SelectedArtistList = ({ artists, parent, onClickRemove }) => (
	<div className="selected-row">
		{artists
			.filter(artist => artist.id !== parent.id)
			.map(artist => (
				<li key={artist.id} className="selected-container">
					{artist.images && (
						<a data-tip data-for={artist.id}>
							<img
								src={minBy(artist.images, 'height').url}
								className="artist-dp"
								onClick={() => onClickRemove(artist.id)}
							/>
						</a>
					)}
					<ReactTooltip id={artist.id} place="top">
						{artist.name}
					</ReactTooltip>
				</li>
			))}
	</div>
);

SelectedArtistList.propTypes = {
	artists: PropTypes.array,
	parent: PropTypes.object,
	onClickRemove: PropTypes.func,
};

export default SelectedArtistList;
