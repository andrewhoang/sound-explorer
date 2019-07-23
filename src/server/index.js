const Router = require('express');
const controller = require('./spotify.controller');

const router = new Router();

router.post('/api/token', controller.refreshToken);

module.exports = router;
