import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CardStyles from '../styled/Card';

class Card extends Component {
	render() {
		let { image, title, subtext, className, style, onClickCard, actions } = this.props;
		return (
			<CardStyles className={`animated fadeIn card ${className}`}>
				<div className="card-body" onClick={onClickCard}>
					<img src={image} className="display-pic animated zoomIn" />
					<div className="card-detail">
						<h5 style={{ ...style }}>{title}</h5>
						<p>{subtext}</p>
					</div>
				</div>
				<div className="card-actions">{actions}</div>
			</CardStyles>
		);
	}
}

Card.propTypes = {
	image: PropTypes.string,
	title: PropTypes.string,
	subtext: PropTypes.string,
	className: PropTypes.string,
	style: PropTypes.object,
	onClickCard: PropTypes.func,
	actions: PropTypes.object,
};

export default Card;
