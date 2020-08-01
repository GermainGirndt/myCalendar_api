import { Router } from 'express';
import BookAppointmentService from '@modules/appointments/services/BookAppointmentService';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

const appointmentsRouter = Router();

appointmentsRouter.post(
    '/book/:from_available_time_id/',
    async (request, response) => {
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
    },
);

export default appointmentsRouter;
