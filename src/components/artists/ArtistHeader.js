import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';

import maxBy from 'lodash/maxBy';
import startCase from 'lodash/startCase';
import commaNumber from 'comma-number';

import SelectedArtistList from './SelectedArtistList';
import { Transition } from 'react-transition-group';

class ArtistHeader extends Component {
	constructor(props) {
		super(props);
		this.state = {
			entered: false,
		};
	}

	componentDidMount() {
		console.log('mounted');
		setTimeout(() => this.setState({ show: true }), 100);
	}

	render() {
		let { artist, selectedArtists, onClickRemove } = this.props;
		let { show } = this.state;

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
						<Transition in={show} timeout={5000}>
							{state => {
								console.log('state', state);
								switch (state) {
									case 'entering':
										return (
											<p className={`fade fade-${state}`}>
												<h1>Personalize your sound</h1>
												<span>Select artists related to the ones you like.</span>
											</p>
										);
									case 'entered':
										return (
											<p className={`fade fade-${state}`}>
												<h1>{artist.name}</h1>
												<span>
													{artist.followers && commaNumber(artist.followers.total)} Followers
												</span>{' '}
												|
												<span>
													{artist.genres &&
														artist.genres
															.slice(0, 3)
															.map(
																(genre, i) =>
																	i == 0
																		? `${startCase(genre)}`
																		: ` ${startCase(genre)}`
															)
															.toString()}
												</span>
											</p>
										);
									case 'exiting':
										return 'Exiting…';
									case 'exited':
										return 'Exited!';
								}
							}}
						</Transition>
					</Col>
				)}
				<SelectedArtistList artists={selectedArtists} parent={artist} onClickRemove={onClickRemove} />
			</Row>
		);
	}
}

export default ArtistHeader;
