import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Header from '../styled/Header';
import { Transition } from 'react-transition-group';
import Button from '../styled/Button';

import maxBy from 'lodash/maxBy';
import commaNumber from 'comma-number';

const ArtistHeader = ({ artist, onClickCreate, savingPlaylist }) => {
	const [show, setShow] = useState(false);

	useEffect(() => {
		setTimeout(() => setShow(true), 100);
	}, []);

	return (
		<Header
			image={`linear-gradient(rgba(0, 0, 0, 0.8), rgba(34, 34, 34, 0.8)), url('${
				artist.images ? maxBy(artist.images, 'height').url : ''
			}')`}
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
													.slice(0, 3)
													.map((genre, i) => (i == 0 ? `${genre}` : ` ${genre}`))
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
		</Header>
	);
};

ArtistHeader.propTypes = {
	artist: PropTypes.object,
	onClickCreate: PropTypes.func,
	savingPlaylist: PropTypes.bool,
};

export default ArtistHeader;
