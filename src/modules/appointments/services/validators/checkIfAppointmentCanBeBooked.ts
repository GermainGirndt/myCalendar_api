import AppError from '@shared/errors/AppError';
import {
    getRepository,
    Repository,
    Between,
    MoreThanOrEqual,
    LessThanOrEqual,
} from 'typeorm';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AvailableTimeForAppointments from '@modules/appointments/infra/typeorm/entities/AvailableTimeForAppointments';
import { Request } from '@modules/appointments/services/BookAppointmentService';

interface ValidationRequestDTO extends Request {
    appointmentsRepository: Repository<Appointment>;
}

export default async function checkIfAppointmentCanBeBooked({
    appointmentsRepository,
    start,
    end,
    forUserId,
    fromAvailableTimeId,
}: ValidationRequestDTO): Promise<void> {
    // check if the choosen date is set as available;

    const availableTimeForAppointmentsRepository = getRepository(
        AvailableTimeForAppointments,
    );
    console.log(fromAvailableTimeId);

    const availableTimeForAppointment = await availableTimeForAppointmentsRepository.findOne(
        {
            where: [
                { id: fromAvailableTimeId },
                { start: LessThanOrEqual(start) },
                { end: MoreThanOrEqual(end) },
            ],
        },
    );

    console.log(availableTimeForAppointment);
    console.log(start);
    console.log(end);

    if (!availableTimeForAppointment) {
        throw new AppError(
            'The selected time interval for booking is not set as available',
        );
    }

    // check if there isn't an appointment booked in the same date within the available time;

    const bookedAppointmentInTheSameDateForTheSameAvailableTime = await appointmentsRepository.findOne(
        {
            where: [
                {
                    start: Between(start, end),
                    from_available_time_id: availableTimeForAppointment.id,
                },
                {
                    end: Between(start, end),
                    from_available_time_id: availableTimeForAppointment.id,
                },
            ],
        },
    );

    if (!!bookedAppointmentInTheSameDateForTheSameAvailableTime) {
        throw new AppError(
            'There is already a appointment booked for the selected time interval.',
        );
    }

    // check if the booking user has no booked/free appointment in this time;

    const customersAppointmentBookedForTheSameDateForThe = await appointmentsRepository.findOne(
        {
            where: [
                {
                    start: Between(start, end),
                    for_user_id: forUserId,
                },
                {
                    end: Between(start, end),
                    for_user_id: forUserId,
                },
            ],
        },
    );

    if (!!customersAppointmentBookedForTheSameDateForThe) {
        throw new AppError(
            'The customer has already a appointment booked for the same date.',
        );
    }
}
