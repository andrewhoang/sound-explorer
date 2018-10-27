import React from 'react';
import { Row, Col } from 'react-bootstrap';

import maxBy from 'lodash/maxBy';
import isEmpty from 'lodash/isEmpty';

const ArtistList = ({ artists, onClickAdd }) => {
	return (
		<Row>
			<h2>Select artists</h2>
			{artists &&
				artists.map(
					artist =>
						!isEmpty(artist.images) && (
							<Col
								md={length % 4 == 0 ? 3 : length % 3 == 0 ? 4 : 3}
								key={artist.id}
								className="item-container"
							>
								<img
									src={maxBy(artist.images, 'height').url}
									className="artist-dp"
									onClick={() => onClickAdd(artist.id)}
								/>
								<h5>{artist.name}</h5>
							</Col>
						)
				)}
			)}
		</Row>
	);
};

export default ArtistList;
