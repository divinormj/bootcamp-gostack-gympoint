import { Router } from 'express';

import CheckinController from './app/controllers/ChekinController';
import EnrollmentController from './app/controllers/EnrollmentController';
import HelpOrderAnswerController from './app/controllers/HelpOrderAnswerController';
import HelpOrderQuestionController from './app/controllers/HelpOrderQuestionController';
import PlanController from './app/controllers/PlanController';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.use(authMiddleware);

routes.post('/enrollments', EnrollmentController.store);
routes.put('/enrollments', EnrollmentController.update);
routes.delete('/enrollments/:id', EnrollmentController.delete);
routes.get('/enrollments', EnrollmentController.index);

routes.post('/plans', PlanController.store);
routes.put('/plans', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);
routes.get('/plans', PlanController.index);

routes.put('/users', UserController.update);

routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);
routes.post('/students/:student_id/checkins', CheckinController.store);
routes.get('/students/:student_id/checkins', CheckinController.index);
routes.post('/students/help_orders', HelpOrderQuestionController.store);
routes.get(
  '/students/:student_id/help_orders',
  HelpOrderQuestionController.index
);

routes.post('/help_orders/answer', HelpOrderAnswerController.store);
routes.get('/help_orders/no_reply', HelpOrderAnswerController.index);

export default routes;
