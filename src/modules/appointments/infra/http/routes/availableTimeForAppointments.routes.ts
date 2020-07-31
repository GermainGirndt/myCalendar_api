import { Router } from 'express';
import { parseISO } from 'date-fns';
import CreateAvailableTimeForAppointmentsService from '@modules/appointments/services/CreateAvailableTimeForAppointmentsService';
import { getRepository } from 'typeorm';
import availableTimeForAppointments from '@modules/appointments/infra/typeorm/entities/AvailableTimeForAppointments';
const availableTimeForAppointmentsRouter = Router();

availableTimeForAppointmentsRouter.get(
    '/:user_id',
    async (request, response) => {
        try {
            const { user_id } = request.params;
            console.log(request.body);

            const availableTimeForAppointmentsRepository = getRepository(
                availableTimeForAppointments,
            );

            const availableTimes = await availableTimeForAppointmentsRepository.find(
                { where: { from_user_id: user_id } },
            );
            console.log(availableTimes);

            return response.status(200).json(availableTimes);
        } catch (err) {
            console.log(err);
            return response.status(400).json({ error: err.message });
        }
    },
);

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
