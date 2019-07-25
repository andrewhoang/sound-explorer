import React from 'react';
import { withRouter } from 'react-router-dom';

import Button from '../styled/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket } from '@fortawesome/free-solid-svg-icons';

const signIn = () => {
	window.location = `${window.location.origin}/login`;
};

const Login = () => (
	<div className="login-page">
		<div className="login-container">
			<sup>Discover New Sound</sup>
			<h1>
				Sound <FontAwesomeIcon icon={faRocket} /> Explorer
			</h1>
			<Button onClick={signIn}>Sign In</Button>
		</div>
	</div>
);

export default withRouter(Login);
