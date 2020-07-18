import { Router } from 'express';

import appointments from './appointments';
import users from './users';

const routes = Router();

routes.use('/appointments', appointments);
routes.use('/users', users);
export default routes;
