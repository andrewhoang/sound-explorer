import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import logo from '/Users/andrewhoang/Documents/Projects/SpotifyApp/spotify-icons-logos/icons/01_RGB/02_PNG/Spotify_Icon_RGB_Green.png';

import { Col, Button } from 'react-bootstrap';

const Login = () => {
	const signIn = () => {
		window.location = 'http://localhost:3000/login';
	};

	return (
		<div className="container">
			<Col md={12}>
				<div className="logo-container">
					<img src={logo} className="logo" />
				</div>
				<Button className="login" onClick={signIn}>
					Sign In
				</Button>
			</Col>
		</div>
	);
};

export default withRouter(Login);
