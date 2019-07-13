import React, { Component } from 'react';

class Card extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let { src, title, subtext, style, onClickCard, actions } = this.props;
		return (
			<div className="card animated">
				<div className="card-body" onClick={onClickCard}>
					<img src={src} className="display-pic animated zoomIn" />
					<div className="card-detail">
						<h5 style={style}>{title}</h5>
						<p>{subtext}</p>
					</div>
				</div>
				<div className="card-actions">{actions}</div>
			</div>
		);
	}
}
export default Card;
