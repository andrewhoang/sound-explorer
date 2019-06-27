import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as spotifyActions from '../../actions/spotifyActions';

import ArtistHeader from './ArtistHeader';
import ArtistList from './ArtistList';
import Button from 'react-bootstrap/lib/Button';

import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import uniqBy from 'lodash/uniqBy';
import queryString from 'query-string';

/* Displays user's selected artist and related artists
 * Clicking on artists will add them to queue for playlist curation
 * Related artists of the selected artists will populate
 */

class ArtistsPage extends Component {
	constructor(props) {
		super(props);
		this.state = { artists: [], selectedArtists: [] };
	}

	componentDidMount = () => {
		let parsed = queryString.parse(location.search);
		let type = Object.keys(parsed).map(query => query)[0];
		let search = Object.values(parsed).map(query => query)[0];
		switch (type) {
			case 'artist':
				this.props.actions.getArtist(search);
				this.props.actions.getRelatedArtists(search);
				break;
			case 'track':
				this.props.actions.getTrack(search);
				break;
		}
	};

	componentWillReceiveProps = nextProps => {
		if (nextProps.artist !== this.props.artist) {
			let selectedArtists = [{ ...nextProps.artist }];
			this.setState({ selectedArtists });
		}
		if (nextProps.artists !== this.props.artists) {
			let relatedArtists = nextProps.artists.artists.filter(artist => {
				if (find(this.state.selectedArtists, { id: artist.id })) {
					return false;
				}
				return artist;
			});
			let artists = [...this.state.artists, ...relatedArtists];
			this.setState({ artists: uniqBy(artists, 'id') });
		}
	};

	handleAddArtist = id => {
		let artists = this.state.artists;
		let selectedArtists = this.state.selectedArtists;

		let artistIdx = findIndex(artists, { id });

		let artist = artists.splice(artistIdx, 1);
		selectedArtists.push(...artist);

		this.setState({ artists, selectedArtists }, () => this.props.actions.getRelatedArtists(id));
	};

	handleRemoveArtist = id => {
		let artists = this.state.artists;
		let selectedArtists = this.state.selectedArtists;

		let artistIdx = findIndex(selectedArtists, { id });

		let artist = selectedArtists.splice(artistIdx, 1);
		artists.push(...artist);

		this.setState({ artists, selectedArtists });
	};

	createPlaylist = () => {
		this.props.actions.createPlaylist('artist', this.state.selectedArtists);
	};

	render = () => {
		let { artist, savingPlaylist } = this.props;
		let { artists, selectedArtists } = this.state;

		return (
			<div className="container">
				<ArtistHeader
					artist={artist}
					selectedArtists={selectedArtists}
					onClickRemove={this.handleRemoveArtist}
					onClickCreate={this.createPlaylist}
					savingPlaylist={savingPlaylist}
				/>
				<ArtistList artists={artists} onClickAdd={this.handleAddArtist} />
				<Button onClick={this.createPlaylist}>
					{savingPlaylist ? 'Creating Playlist...' : 'Create Playlist'}
				</Button>
			</div>
		);
	};
}

ArtistsPage.propTypes = {
	actions: PropTypes.object,
	results: PropTypes.array,
	artist: PropTypes.object,
	artists: PropTypes.object,
	savingPlaylist: PropTypes.bool,
};

function mapStateToProps(state) {
	return {
		results: state.reducers.results,
		artist: state.reducers.artist,
		artists: state.reducers.artists,
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
