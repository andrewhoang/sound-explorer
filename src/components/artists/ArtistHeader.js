import React from 'react';
import { Row, Col } from 'react-bootstrap';

import maxBy from 'lodash/maxBy';
import startCase from 'lodash/startCase';
import commaNumber from 'comma-number';

import SelectedArtistList from './SelectedArtistList';

const ArtistHeader = ({ artist, selectedArtists, onClickRemove }) => {
	return (
		<Row>
			{artist.images && (
				<Col
					md={12}
					className="header"
					style={{
						backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(34, 34, 34, 0.8)), url('${
							maxBy(artist.images, 'height').url
						}')`,
					}}
				>
					<h1>{artist.name}</h1>
					<p>
						<span>{artist.followers && commaNumber(artist.followers.total)} Followers</span> |
						<span>
							{artist.genres &&
								artist.genres
									.slice(0, 3)
									.map((genre, i) => (i == 0 ? `${startCase(genre)}` : ` ${startCase(genre)}`))
									.toString()}
						</span>
					</p>
				</Col>
			)}
			<SelectedArtistList artists={selectedArtists} parent={artist} onClickRemove={onClickRemove} />
		</Row>
	);
};

export default ArtistHeader;
