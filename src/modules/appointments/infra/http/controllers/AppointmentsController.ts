import { container } from 'tsyringe';

import { Request, Response } from 'express';

import { parseISO } from 'date-fns';

import BookAppointmentService from '@modules/appointments/services/BookAppointmentService';

export default class AppointmentsController {
    async create(request: Request, response: Response): Promise<Response> {
        console.log('Incoming post Request - Create Appointment');

        try {
            const { from_available_time_id } = request.params;
            const { forUserId, start, end } = request.body;

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
