import React from 'react';
import { withRouter } from 'react-router-dom';

import { Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
	const signIn = () => {
		window.location = window.location.origin.includes('localhost')
			? `http://localhost:3000/login`
			: 'https://soundexplorer.herokuapp.com/login';
	};

	return (
		<div className="login-container">
			<Col md={12}>
				<div className="logo-container">
					<h1>
						Sound <FontAwesomeIcon icon={faRocket} /> Explorer
					</h1>
				</div>
				<Button className="login" onClick={signIn}>
					Sign In
				</Button>
			</Col>
		</div>
	);
};

export default withRouter(Login);
