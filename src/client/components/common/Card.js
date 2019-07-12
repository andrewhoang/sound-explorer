import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

class Card extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let { src, title, subtext, style, onClickCard, onClickLike } = this.props;
		return (
			<div className="card animated fadeInUp">
				<div className="card-body" onClick={onClickCard}>
					<img src={src} className="display-pic animated zoomIn" />
					<div className="card-detail">
						<h5 style={style}>{title}</h5>
						<p>{subtext}</p>
					</div>
				</div>
				{onClickLike && <FontAwesomeIcon icon={faHeart} onClick={onClickLike} />}
			</div>
		);
	}
}
export default Card;
