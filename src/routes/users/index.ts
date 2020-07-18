import { Router } from 'express';
import users from './users.routes';
import available_times from './available_times.routes';

const routes = Router();
routes.use('/', users);
routes.use('/available-time', available_times);

export default routes;
