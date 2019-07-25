import React, { Component } from 'react';
import PropTypes from 'prop-types';

import List from '../styled/List';
import Card from '../common/Card';

import maxBy from 'lodash/maxBy';

class ArtistList extends Component {
	render() {
		const { artists, onClickAdd } = this.props;

		return (
			<div style={{ position: 'relative' }}>
				{artists.length ? (
					<List
						duration={700}
						delay={150}
						staggerDurationBy={15}
						staggerDelayBy={20}
						easing="ease"
						enterAnimation="elevator"
						leaveAnimation="elevator"
					>
						{artists
							.filter(artist => artist.images.length > 0)
							.map((artist, i) => (
								<Card
									key={i}
									image={maxBy(artist.images, 'height').url}
									title={artist.name}
									subtext={artist.genres.slice(0, 3).join(', ')}
									onClickCard={() => onClickAdd(artist.id)}
								/>
							))}
					</List>
				) : (
					<h3 className="vertical-center">No available artists</h3>
				)}
			</div>
		);
	}
}

ArtistList.propTypes = {
	artists: PropTypes.array,
	onClickAdd: PropTypes.func,
};

export default ArtistList;
