import { Router } from 'express';
import AvailableTimeForAppointmentsController from '@modules/appointments/infra/http/controllers/AvailableTimeForAppointmentsController';

const availableTimeForAppointmentsController = new AvailableTimeForAppointmentsController();

const availableTimeForAppointmentsRouter = Router();

availableTimeForAppointmentsRouter.get(
    '/:user_id',
    availableTimeForAppointmentsController.index,
);

availableTimeForAppointmentsRouter.post(
    '/create/user/:user_id',
    availableTimeForAppointmentsController.create,
);

export default availableTimeForAppointmentsRouter;
