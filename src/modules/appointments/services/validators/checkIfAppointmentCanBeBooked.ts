import AppError from '@shared/errors/AppError';
import { getRepository, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AvailableTimeForAppointments from '@modules/appointments/infra/typeorm/entities/AvailableTimeForAppointments';
import IBookAppointmentDTO from '@modules/appointments/dtos/IBookAppointmentDTO';

interface ValidationRequestDTO extends IBookAppointmentDTO {
    appointmentsRepository: IAppointmentsRepository;
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

    const availableTimeForAppointment = await availableTimeForAppointmentsRepository.findOne(
        {
            where: [
                { id: fromAvailableTimeId },
                { start: LessThanOrEqual(start) },
                { end: MoreThanOrEqual(end) },
            ],
        },
    );

    if (!availableTimeForAppointment) {
        throw new AppError(
            'The selected time interval for booking is not set as available',
        );
    }

    // check if there isn't an appointment booked in the same date within the available time;

    const bookedAppointmentInTheSameDateForTheSameAvailableTime = await appointmentsRepository.findAppointmentBetweenDatesForAvailableTime(
        {
            start,
            end,
            availableTimeForAppointmentId: availableTimeForAppointment.id,
        },
    );

    if (!!bookedAppointmentInTheSameDateForTheSameAvailableTime) {
        throw new AppError(
            'There is already a appointment booked for the selected time interval.',
        );
    }

    // check if the booking user has no booked/free appointment in this time;

    const customersAppointmentBookedForTheSameDateForThe = await appointmentsRepository.findAppointmentBetweenDatesForUser(
        { forUserId, start, end },
    );

    if (!!customersAppointmentBookedForTheSameDateForThe) {
        throw new AppError(
            'The customer has already a appointment booked for the same date.',
        );
    }
}
