import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Spinner from './Spinner';
import * as CountriesActions from '../actions/CountriesActions';
import Countries from './Home';

export class CountriesContainer extends Component {
	componentDidMount() {
		this.props.actions.fetchCountries('https://restcountries.eu/rest/v1/all');
	}

	render() {
		const { countries, actions } = this.props;

		return <div>{countries.isLoading ? <Spinner /> : <Countries countries={countries} actions={actions} />}</div>;
	}
}

CountriesContainer.propTypes = {
	countries: PropTypes.object.isRequired,
	actions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
	return {
		countries: state.countries,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(CountriesActions, dispatch),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CountriesContainer);
