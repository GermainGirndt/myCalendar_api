import { Router } from 'express';
import { parseISO } from 'date-fns';
import CreateAvailableTimeForAppointmentsService from '../services/CreateAvailableTimeForAppointmentsService';

const availableTimeForAppointmentsRouter = Router();

availableTimeForAppointmentsRouter.post(
    '/user/:user_id',
    async (request, response) => {
        try {
            const { user_id } = request.params;
            const { start, end } = request.body;
            console.log(user_id);
            console.log(start, end);

            const createAvailableTimeForAppointmentsService = new CreateAvailableTimeForAppointmentsService();

            const availableTimeForAppointment = await createAvailableTimeForAppointmentsService.execute(
                {
                    start: parseISO(start),
                    end: parseISO(end),
                    fromUserId: user_id,
                },
            );

            return response.status(201).json(availableTimeForAppointment);
        } catch (err) {
            console.log(err);
            return response.status(400).json(err);
        }
    },
);

export default availableTimeForAppointmentsRouter;
