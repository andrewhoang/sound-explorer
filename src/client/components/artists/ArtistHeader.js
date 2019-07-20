import React, { useState, useEffect } from 'react';

import SelectedArtistList from './SelectedArtistList';
import { Transition } from 'react-transition-group';
import { Row, Col, Button } from 'react-bootstrap';

import maxBy from 'lodash/maxBy';
import startCase from 'lodash/startCase';
import commaNumber from 'comma-number';

const ArtistHeader = ({ artist, selectedArtists, onClickRemove, onClickCreate, savingPlaylist }) => {
	const [show, setShow] = useState(false);

	useEffect(() => {
		setTimeout(() => setShow(true), 300);
	});

	return (
		<Row>
			{/* <Col
				md={12}
				className="header"
				style={{
					backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(34, 34, 34, 0.8)), url('${
						artist.images ? maxBy(artist.images, 'height').url : ''
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
											<span className="desktop">
												{artist.genres && ' | '}
												{artist.genres &&
													artist.genres
														.slice(0, 4)
														.map((genre, i) =>
															i == 0 ? `${startCase(genre)}` : ` ${startCase(genre)}`
														)
														.toString()}
											</span>
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
				<Button onClick={onClickCreate}>{savingPlaylist ? 'Creating Playlist...' : 'Create Playlist'}</Button>
			</Col>
			<SelectedArtistList artists={selectedArtists} parent={artist} onClickRemove={onClickRemove} /> */}
		</Row>
	);
};

export default ArtistHeader;
