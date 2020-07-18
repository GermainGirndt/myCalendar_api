import { Router } from 'express';

import appointments from './appointments.routes';
import users from './users.routes';
import availableTimeForAppointments from './availableTimeForAppointments.routes';

const routes = Router();

routes.use('/appointments', appointments);
routes.use('/users', users);
routes.use('/available_time', availableTimeForAppointments);

export default routes;
