import { getRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import validateRequestDTOBookAppointment from '../validators/validateRequestDTOBookAppointment';
import checkIfAppointmentCanBeBooked from '../validators/checkIfAppointmentCanBeBooked';

export interface Request {
    fromAvailableTimeId: string;
    forUserId: string;
    start: Date;
    end: Date;
}

class BookAppointmentService {
    public async execute({
        fromAvailableTimeId,
        forUserId,
        start,
        end,
    }: Request): Promise<Appointment> {
        validateRequestDTOBookAppointment({
            fromAvailableTimeId,
            forUserId,
            start,
            end,
        });

        const appointmentsRepository = getRepository(Appointment);

        await checkIfAppointmentCanBeBooked({
            appointmentsRepository,
            forUserId,
            fromAvailableTimeId,
            start,
            end,
        });

        const availableAppointment = appointmentsRepository.create({
            from_available_time_id: fromAvailableTimeId,
            for_user_id: forUserId,
            start,
            end,
        });

        await appointmentsRepository.save(availableAppointment);

        return availableAppointment;
    }
}

export default BookAppointmentService;
