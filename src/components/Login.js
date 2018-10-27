import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import logo from '../styles/spotify-icons-logos/icons/01_RGB/02_PNG/Spotify_Icon_RGB_Green.png';

import { Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
	const signIn = () => {
		window.location = 'https://soundexplorer.herokuapp.com/login';
		// window.location = `http://localhost:3000/login`;
	};

	return (
		<div className="login-container">
			<Col md={12}>
				<div className="logo-container">
					{/* <img src={logo} className="logo" /> */}
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
