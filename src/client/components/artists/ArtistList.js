import React, { Component } from 'react';

import maxBy from 'lodash/maxBy';
import isEmpty from 'lodash/isEmpty';
import FlipMove from 'react-flip-move';

// const formatEasing = () => {
// 	let arr = ['0.39', '0', '0.45', '1.4'];
// 	return `cubic-bezier(${arr.join(',')})`;
// };

const ArtistList = ({ artists, onClickAdd }) => {
	return (
		artists && (
			<FlipMove
				duration={700}
				delay={150}
				easing={'ease'}
				staggerDurationBy={15}
				staggerDelayBy={20}
				enterAnimation="fade"
				leaveAnimation="elevator"
				className="list"
			>
				{artists
					.filter(artist => artist.images.length > 0)
					.map((artist, i) => (
						<div key={i} className="item-container animated fadeInUp" onClick={() => onClickAdd(artist.id)}>
							<img src={maxBy(artist.images, 'height').url} className="display-pic" />
							<div className="card-detail">
								<h5>{artist.name}</h5>
								<h6>{artist.genres.slice(0, 3).join(', ')}</h6>
							</div>
						</div>
					))}
			</FlipMove>
		)
	);
};

export default ArtistList;
