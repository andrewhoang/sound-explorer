import React, { Component } from 'react';
import PropTypes from 'prop-types';

import WaveModal from 'reboron/WaveModal';

class Modal extends Component {
	state = {};

	componentWillUpdate = nextProps => {
		const { id, modal } = nextProps;

		if (modal !== this.props.modal) {
			if (id === modal.id && modal.show) {
				this.refs.modal.show();
			} else {
				this.refs.modal.hide();
			}
		}
	};

	close = () => {
		const { close, id } = this.props;
		close(id);
	};

	render() {
		const { id, title, body } = this.props;

		return (
			<div id={id}>
				<WaveModal ref="modal" className="view-modal">
					<div className={`modal-md`}>
						<div className="modal-header">
							<h2 className="modal-title">{title}</h2>
						</div>
						<div className="modal-body">{body}</div>
					</div>
				</WaveModal>
			</div>
		);
	}
}

Modal.propTypes = {
	modal: PropTypes.object,
	id: PropTypes.string,
	title: PropTypes.string,
	body: PropTypes.object,
};

export default Modal;
