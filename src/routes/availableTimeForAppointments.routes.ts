import { Router } from 'express';
import { parseISO } from 'date-fns';
import CreateAvailableTimeForAppointmentsService from '../services/CreateAvailableTimeForAppointmentsService';

const availableTimeForAppointmentsRouter = Router();

availableTimeForAppointmentsRouter.post(
    '/create/user/:user_id',
    async (request, response) => {
        try {
            const { user_id } = request.params;
            const { start, end } = request.body;

            const createAvailableTimeForAppointmentsService = new CreateAvailableTimeForAppointmentsService();

            const availableTimeForAppointments = await createAvailableTimeForAppointmentsService.execute(
                {
                    start: parseISO(start),
                    end: parseISO(end),
                    fromUserId: user_id,
                },
            );

            return response.status(201).json(availableTimeForAppointments);
        } catch (err) {
            console.log(err);
            return response.status(400).json({ error: err.message });
        }
    },
);

export default availableTimeForAppointmentsRouter;
