import { container } from 'tsyringe';

import { Request, Response } from 'express';

import { parseISO } from 'date-fns';

import BookAppointmentService from '@modules/appointments/services/Appointments/BookAppointmentService';

import FindAllAppointmentsForUserService from '@modules/appointments/services/Appointments/FindAllAppointmentsForUserService';

export default class AppointmentsController {
    async index(request: Request, response: Response): Promise<Response> {
        try {
            const { user_id } = request.params;

            const findAllAppointmentsForUserService = container.resolve(
                FindAllAppointmentsForUserService,
            );

            const availableTimes = await findAllAppointmentsForUserService.execute(
                { userId: user_id },
            );

            return response.status(200).json(availableTimes);
        } catch (err) {
            console.log(err);
            return response.status(400).json({ error: err.message });
        }
    }

    async create(request: Request, response: Response): Promise<Response> {
        console.log('Incoming post Request - Create Appointment');

        try {
            const { from_available_time_id } = request.params;
            const { forUserId, start, end } = request.body;

            console.log('executing book appointment service');

            const bookAppointmentService = container.resolve(
                BookAppointmentService,
            );
            const appointment = await bookAppointmentService.execute({
                fromAvailableTimeId: from_available_time_id,
                forUserId,
                start: parseISO(start),
                end: parseISO(end),
            });

            return response.status(202).json(appointment);
        } catch (err) {
            console.log(err);
            return response.status(400).json({ error: err.message });
        }
    }
}
