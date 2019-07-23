import React, { Component } from 'react';

import FlipMove from 'react-flip-move';
import Card from '../common/Card';

import maxBy from 'lodash/maxBy';

class ArtistList extends Component {
	render() {
		let { artists, onClickAdd } = this.props;

		return (
			<div style={{ position: 'relative' }}>
				{artists.length ? (
					<FlipMove
						duration={700}
						delay={150}
						staggerDurationBy={15}
						staggerDelayBy={20}
						easing="ease"
						enterAnimation="fade"
						leaveAnimation="elevator"
						className="list"
					>
						{artists
							.filter(artist => artist.images.length > 0)
							.map((artist, i) => (
								<Card
									key={i}
									onClickCard={() => onClickAdd(artist.id)}
									src={maxBy(artist.images, 'height').url}
									title={artist.name}
									subtext={artist.genres.slice(0, 3).join(', ')}
								/>
							))}
					</FlipMove>
				) : (
					<h3 className="vertical-center">No available artists</h3>
				)}
			</div>
		);
	}
}

export default ArtistList;
