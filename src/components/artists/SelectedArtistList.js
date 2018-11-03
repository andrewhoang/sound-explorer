import React from 'react';
import { Row, Col } from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';
import minBy from 'lodash/minBy';

const SelectedArtistList = ({ artists, parent, onClickRemove }) => {
	return (
		<Row className="selected-row">
			{artists.filter(artist => artist.id !== parent.id).map(artist => (
				<li key={artist.id} className="selected-container">
					{artist.images && (
						<a data-tip data-for={`${artist.id}`}>
							<img
								src={minBy(artist.images, 'height').url}
								className="artist-dp"
								onClick={() => onClickRemove(artist.id)}
							/>
						</a>
					)}
					<ReactTooltip id={`${artist.id}`} place="top">
						<span>{artist.name}</span>
					</ReactTooltip>
				</li>
			))}
		</Row>
	);
};

export default SelectedArtistList;
