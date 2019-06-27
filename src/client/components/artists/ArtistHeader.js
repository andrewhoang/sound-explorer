import React, { Component } from 'react';

import SelectedArtistList from './SelectedArtistList';
import { Transition } from 'react-transition-group';
import { Row, Col, Button } from 'react-bootstrap';

import maxBy from 'lodash/maxBy';
import startCase from 'lodash/startCase';
import commaNumber from 'comma-number';

class ArtistHeader extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
		};
	}

	componentDidMount = () => {
		setTimeout(() => this.setState({ show: true }), 300);
	};

	render() {
		let { artist, selectedArtists, onClickRemove, onClickCreate, savingPlaylist } = this.props;
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
								switch (state) {
									case 'entering':
										return (
											<span className={`fade fade-${state}`}>
												<h1>Personalize your sound</h1>
												<p className="subtext">Select artists related to the ones you like.</p>
											</span>
										);
									case 'entered':
										return (
											<span className={`fade fade-${state}`}>
												<h1>{artist.name}</h1>
												<p className="subtext">
													{artist.followers && commaNumber(artist.followers.total)} Followers
													{artist.genres && ' | '}
													{artist.genres &&
														artist.genres
															.slice(0, 4)
															.map((genre, i) =>
																i == 0 ? `${startCase(genre)}` : ` ${startCase(genre)}`
															)
															.toString()}
												</p>
											</span>
										);
									case 'exiting':
										return <span />;
									case 'exited':
										return <span />;
								}
							}}
						</Transition>
						<Button onClick={onClickCreate}>
							{savingPlaylist ? 'Creating Playlist...' : 'Create Playlist'}
						</Button>
					</Col>
				)}
				<SelectedArtistList artists={selectedArtists} parent={artist} onClickRemove={onClickRemove} />
			</Row>
		);
	}
}

export default ArtistHeader;
