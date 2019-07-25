import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as spotifyActions from '../../actions/spotifyActions';

import Container from '../styled/Container';
import ArtistHeader from './ArtistHeader';
import ArtistList from './ArtistList';
import SelectedArtistList from './SelectedArtistList';
import Button from '../styled/Button';

import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import uniqBy from 'lodash/uniqBy';
import queryString from 'query-string';

/* Displays user's selected artist and related artists
 * Clicking on artists will add them to queue for playlist curation
 * Related artists of the selected artists will populate
 */

class ArtistsPage extends Component {
	state = { artists: [], selectedArtists: [] };

	componentDidMount = () => {
		const { artist } = queryString.parse(location.search);
		this.props.actions.getArtist(artist);
		this.props.actions.getRelatedArtists(artist);
	};

	componentWillReceiveProps = nextProps => {
		if (nextProps.artist !== this.props.artist) {
			const selectedArtists = [nextProps.artist];
			this.setState({ selectedArtists });
		}

		if (nextProps.artists !== this.props.artists) {
			const relatedArtists = nextProps.artists.filter(artist => {
				/* Filter out artists already selected */
				if (find(this.state.selectedArtists, { id: artist.id })) {
					return false;
				}
				return artist;
			});

			const artists = [...this.state.artists, ...relatedArtists];
			this.setState({ artists: uniqBy(artists, 'id') });
		}
	};

	handleAddArtist = id => {
		let { artists, selectedArtists } = this.state;

		const artistIdx = findIndex(artists, { id });

		selectedArtists = [].concat(artists.splice(artistIdx, 1), selectedArtists);

		this.setState({ artists, selectedArtists }, () => this.props.actions.getRelatedArtists(id));
	};

	handleRemoveArtist = id => {
		let { artists, selectedArtists } = this.state;

		const artistIdx = findIndex(selectedArtists, { id });

		artists = [].concat(selectedArtists.splice(artistIdx, 1), artists);

		this.setState({ artists, selectedArtists });
	};

	createPlaylist = () => {
		this.props.actions.createPlaylist('artist', this.state.selectedArtists);
	};

	render = () => {
		const { artist, player, savingPlaylist } = this.props;
		const { artists, selectedArtists } = this.state;

		return (
			<Container className="animated fadeIn" player={player.track}>
				<ArtistHeader artist={artist} onClickCreate={this.createPlaylist} savingPlaylist={savingPlaylist} />
				<SelectedArtistList artists={selectedArtists} parent={artist} onClickRemove={this.handleRemoveArtist} />
				<ArtistList artists={artists} onClickAdd={this.handleAddArtist} />
				{selectedArtists.length > 1 && (
					<Button onClick={this.createPlaylist}>
						{savingPlaylist ? 'Creating Playlist...' : 'Create Playlist'}
					</Button>
				)}
			</Container>
		);
	};
}

ArtistsPage.propTypes = {
	actions: PropTypes.object,
	artist: PropTypes.object,
	artists: PropTypes.array,
	player: PropTypes.object,
	savingPlaylist: PropTypes.bool,
};

function mapStateToProps(state) {
	return {
		artist: state.reducers.artist,
		artists: state.reducers.artists,
		player: state.reducers.player,
		savingPlaylist: state.reducers.savingPlaylist,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({ ...spotifyActions }, dispatch),
	};
}

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(ArtistsPage)
);
