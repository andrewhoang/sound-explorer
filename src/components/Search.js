import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import autoBind from 'react-autobind';

import * as musicActions from '../actions/musicActions';

import ArtistHeader from './artists/ArtistHeader';
import ArtistList from './artists/ArtistList';
import { Button } from 'react-bootstrap';

import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import uniqBy from 'lodash/uniqBy';
import queryString from 'query-string';

class Search extends Component {
	constructor(props) {
		super(props);
		this.state = { artists: [], selectedArtists: [] };
		autoBind(this);
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

	handleAdd = id => {
		let artists = this.state.artists;
		let selectedArtists = this.state.selectedArtists;

		let artistIdx = findIndex(artists, { id });

		let artist = artists.splice(artistIdx, 1);
		selectedArtists.push(...artist);

		this.setState({ artists, selectedArtists }, () => this.props.actions.getRelatedArtists(id));
	};

	handleRemove = id => {
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

	render() {
		let { artist } = this.props;
		let { artists, selectedArtists } = this.state;

		return (
			<div className="container">
				<ArtistHeader artist={artist} selectedArtists={selectedArtists} onClickRemove={this.handleRemove} />
				<ArtistList artists={artists} onClickAdd={this.handleAdd} />
				<Button onClick={this.createPlaylist}>Create Playlist</Button>
			</div>
		);
	}
}

Search.propTypes = {
	actions: PropTypes.object,
	results: PropTypes.object,
	artist: PropTypes.object,
	artists: PropTypes.object,
};

function mapStateToProps(state) {
	return {
		results: state.reducers.results,
		artist: state.reducers.artist,
		artists: state.reducers.artists,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({ ...musicActions }, dispatch),
	};
}

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Search)
);
