import { Router } from 'express';
import users from './users.routes';
import available_time from './available_time.routes';

const routes = Router();
routes.use('/', users);
routes.use('/available-time', available_time);

export default routes;
