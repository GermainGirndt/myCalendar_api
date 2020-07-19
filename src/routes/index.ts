import { Router } from 'express';

import appointments from './appointments.routes';
import users from './users.routes';
import availableTimeForAppointments from './availableTimeForAppointments.routes';

const routes = Router();

routes.use('/users', users);
routes.use('/available_time', availableTimeForAppointments);
routes.use('/appointments', appointments);

export default routes;
