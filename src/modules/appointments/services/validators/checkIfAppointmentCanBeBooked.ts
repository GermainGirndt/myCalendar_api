import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IAvailableTimeForAppointmentsRepository from '@modules/appointments/repositories/IAvailableTimeForAppointmentsRepository';

import IBookAppointmentDTO from '@modules/appointments/dtos/IBookAppointmentDTO';

import AppError from '@shared/errors/AppError';

interface ValidationRequestDTO extends IBookAppointmentDTO {
    appointmentsRepository: IAppointmentsRepository;
    availableTimeForAppointmentsRepository: IAvailableTimeForAppointmentsRepository;
}

export default async function checkIfAppointmentCanBeBooked({
    appointmentsRepository,
    availableTimeForAppointmentsRepository,
    start,
    end,
    forUserId,
    fromAvailableTimeId,
}: ValidationRequestDTO): Promise<void> {
    // check if the choosen date is in the period of time set as available by the service provider;

    const availableTime = await availableTimeForAppointmentsRepository.findById(
        { availableTimeId: fromAvailableTimeId },
    );

    if (!availableTime) {
        throw new AppError('Could not find the selected available time id');
    }

    const availableTimeForAppointment = await availableTimeForAppointmentsRepository.findAvailableTimeFromUserBetweenDates(
        { fromUserId: availableTime.from_user_id, start, end },
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
