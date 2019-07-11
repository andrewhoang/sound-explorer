import React, { Component } from 'react';

class Card extends Component {
	render() {
		let { src, title, subtext, style, onClickCard } = this.props;
		return (
			<div className="item-container animated fadeInUp" onClick={onClickCard}>
				<img src={src} className="display-pic animated zoomIn" />
				<div className="card-detail">
					<h5 style={style}>{title}</h5>
					<p>{subtext}</p>
				</div>
			</div>
		);
	}
}
export default Card;
