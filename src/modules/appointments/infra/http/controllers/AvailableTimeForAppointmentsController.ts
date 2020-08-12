import { container } from 'tsyringe';

import { Request, Response } from 'express';
import { parseISO } from 'date-fns';

import CreateAvailableTimeForAppointmentsService from '@modules/appointments/services/CreateAvailableTimeForAppointmentsService';
import FindAllAvailableTimeForUserService from '@modules/appointments/services/FindAllAvailableTimeForUserService';

export default class AvailableTimeForAppointmentsController {
    async index(request: Request, response: Response): Promise<Response> {
        try {
            const { user_id } = request.params;

            const findAllAvailableTimeForUserService = container.resolve(
                FindAllAvailableTimeForUserService,
            );

            const availableTimes = await findAllAvailableTimeForUserService.execute(
                { userId: user_id },
            );

            return response.status(200).json(availableTimes);
        } catch (err) {
            console.log(err);
            return response.status(400).json({ error: err.message });
        }
    }

    async create(request: Request, response: Response): Promise<Response> {
        try {
            const { user_id } = request.params;
            const { start, end } = request.body;

            const createAvailableTimeForAppointmentsService = container.resolve(
                CreateAvailableTimeForAppointmentsService,
            );

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
    }
}
