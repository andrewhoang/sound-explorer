import React, { Component } from 'react';
import WaveModal from 'reboron/WaveModal';
import autoBind from 'react-autobind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

class Modal extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		autoBind(this);
	}

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
		const { id, size, title, body, footer } = this.props;

		return (
			<div id={id}>
				<WaveModal ref="modal" className="view-modal">
					<div className={`modal-md`}>
						<div className="modal-header">
							<h2 className="modal-title">{title}</h2>
						</div>
						<div className="modal-body">{body}</div>
						<div className="modal-footer" />
					</div>
				</WaveModal>
			</div>
		);
	}
}

export default Modal;
