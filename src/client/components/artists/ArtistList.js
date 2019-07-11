import React, { Component } from 'react';

import FlipMove from 'react-flip-move';
import Card from '../common/Card';

import maxBy from 'lodash/maxBy';

class ArtistList extends Component {
	renderArtists = () => {
		let { artists, onClickAdd } = this.props;
		return artists
			.filter(artist => artist.images.length > 0)
			.map((artist, i) => (
				<Card
					key={i}
					onClickCard={() => onClickAdd(artist.id)}
					src={maxBy(artist.images, 'height').url}
					style={{}}
					title={artist.name}
					subtext={artist.genres.slice(0, 3).join(', ')}
				/>
			));
	};

	render() {
		return (
			<FlipMove
				duration={700}
				delay={150}
				easing={'ease'}
				staggerDurationBy={15}
				staggerDelayBy={20}
				enterAnimation="fade"
				leaveAnimation="accordionVertical"
				className="list"
			>
				{this.renderArtists()}
			</FlipMove>
		);
	}
}

export default ArtistList;
