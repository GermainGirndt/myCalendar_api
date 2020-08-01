import AppError from '@shared/errors/AppError';
import IAvailableTimeForAppointmentsRepository from '@modules/appointments/repositories/IAvailableTimeForAppointmentsRepository';
import ICreateAvailableTimeForAppointmentsDTO from '@modules/appointments/dtos/ICreateAvailableTimeForAppointmentsDTO';

interface ValidationRequestDTO extends ICreateAvailableTimeForAppointmentsDTO {
    availableTimesForAppointmentsRepository: IAvailableTimeForAppointmentsRepository;
}

export default async function checkIfAppointmentCanBeAvailableinDB({
    availableTimesForAppointmentsRepository,
    start,
    end,
    fromUserId,
}: ValidationRequestDTO): Promise<void> {
    const availableTimeForAppointmentInTheSameDate = await availableTimesForAppointmentsRepository.findAvailableTimeFromUserBetweenDates(
        { start, end, fromUserId },
    );

    if (!!availableTimeForAppointmentInTheSameDate) {
        throw new AppError(
            'The selected time interval is already set as available',
        );
    }
}
