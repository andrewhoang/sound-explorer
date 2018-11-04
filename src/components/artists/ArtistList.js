import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';

import maxBy from 'lodash/maxBy';
import isEmpty from 'lodash/isEmpty';
import FlipMove from 'react-flip-move';

class ArtistList extends Component {
	constructor(props) {
		super(props);
	}

	formatEasing = () => {
		let arr = ['0.39', '0', '0.45', '1.4'];
		return `cubic-bezier(${arr.join(',')})`;
	};

	render() {
		let { artists, onClickAdd } = this.props;

		return (
			<Row className="artist-list">
				{artists && (
					<FlipMove duration={700} delay={150} easing={'ease'} staggerDurationBy={15} staggerDelayBy={20}>
						{artists.map(
							artist =>
								!isEmpty(artist.images) && (
									<Col
										md={length % 4 == 0 ? 3 : length % 3 == 0 ? 4 : 3}
										sm={6}
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
					</FlipMove>
				)}
			</Row>
		);
	}
}

export default ArtistList;
