import { Router } from 'express';

import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';

const appointmentsRouter = Router();

const appointmentsController = new AppointmentsController();

appointmentsRouter.get('/:user_id', appointmentsController.index);

appointmentsRouter.post(
    '/book/:from_available_time_id/',
    appointmentsController.create,
);

export default appointmentsRouter;
