import { Router } from 'express';
import controller from './spotify.controller';

const router = new Router();

router.post('/api/token', controller.refreshToken);

module.exports = router;
