import { Router } from 'express';

import appointments from '@modules/appointments/infra/http/routes/appointments.routes';
import availableTimeForAppointments from '@modules/appointments/infra/http/routes/availableTimeForAppointments.routes';
import users from '@modules/users/infra/http/routes/users.routes';

const routes = Router();

routes.use('/users', users);
routes.use('/available_time', availableTimeForAppointments);
routes.use('/appointments', appointments);

export default routes;
