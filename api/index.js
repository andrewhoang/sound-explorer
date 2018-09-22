import { Router } from 'express';
import controller from './spotify.controller';

const router = new Router();

router.get('/api/authorize', controller.authorize());
router.post('/api/token', controller.getToken());

module.exports = router;
