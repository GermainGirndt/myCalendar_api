import AppError from '../error/AppError';
import { Repository, Between } from 'typeorm';
import AvailableTimeForAppointments from '../models/AvailableTimeForAppointments';
import { Request } from '../services/CreateAvailableTimeForAppointmentsService';

interface ValidationRequestDTO extends Request {
    availableTimesForAppointmentsRepository: Repository<
        AvailableTimeForAppointments
    >;
}

export default async function checkIfAppointmentCanBeAvailableinDB({
    availableTimesForAppointmentsRepository,
    start,
    end,
    fromUserId,
}: ValidationRequestDTO): Promise<void> {
    const availableTimeForAppointmentInTheSameDate = await availableTimesForAppointmentsRepository.findOne(
        {
            where: [
                { start: Between(start, end), from_user_id: fromUserId },
                { end: Between(start, end), from_user_id: fromUserId },
            ],
        },
    );

    if (!!availableTimeForAppointmentInTheSameDate) {
        throw new AppError(
            'The selected time interval is already set as available',
        );
    }
}
