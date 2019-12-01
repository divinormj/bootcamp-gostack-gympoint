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

/**
 * O aluno não é autenicado,
 * o checkin e pedidos de ajuda são feitos com base no ID.
 */
routes.get('/students/:id', StudentController.show);
routes.post('/students/:id/checkins', CheckinController.store);
routes.get('/students/:id/checkins', CheckinController.index);
routes.post('/students/help_orders', HelpOrderQuestionController.store);
routes.get('/students/:id/help_orders', HelpOrderQuestionController.index);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/enrollments', EnrollmentController.store);
routes.put('/enrollments', EnrollmentController.update);
routes.delete('/enrollments', EnrollmentController.delete);
routes.get('/enrollments/:id', EnrollmentController.show);
routes.get('/enrollments', EnrollmentController.index);

routes.post('/plans', PlanController.store);
routes.put('/plans', PlanController.update);
routes.delete('/plans', PlanController.delete);
routes.get('/plans/:id', PlanController.show);
routes.get('/plans', PlanController.index);

routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);
routes.delete('/students', StudentController.delete);
routes.get('/students', StudentController.index);
routes.post('/students/help_orders', HelpOrderQuestionController.store);
routes.get(
  '/students/:student_id/help_orders',
  HelpOrderQuestionController.index
);

routes.put('/help_orders', HelpOrderAnswerController.update);
routes.get('/help_orders/no_reply', HelpOrderAnswerController.index);

export default routes;
