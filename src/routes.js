import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
// import UserController from './app/controllers/UserController';
import StudentController from './app/controllers/StudentController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/', (req, res) => res.json({ ok: 'google' }));

routes.post('/sessions', SessionController.store);
// routes.post('/users', UserController.store);

routes.use(authMiddleware);

// routes.put('/users', UserController.update);

routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);

export default routes;
