import { Router } from 'express';

import appointments from './appointments';
import users from './users';
// import appointmentsRouter from "./appointments.routes";

const routes = Router();

routes.use('/appointments', appointments);
routes.use('/users', users);
export default routes;
