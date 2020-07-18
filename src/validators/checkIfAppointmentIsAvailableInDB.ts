import AppError from '../error/AppError';
import { Repository, Between } from 'typeorm';
import AvailableTimeForAppointments from '../models/AvailableTimeForAppointments';
import { Request } from '../services/CreateAvailableTimeForAppointmentsService';

interface ValidationRequestDTO extends Request {
    repository: Repository<AvailableTimeForAppointments>;
}

export default async function checkIfAppointmentIsAvailableinDB({
    repository,
    start,
    end,
    fromUserId,
}: ValidationRequestDTO): Promise<void> {
    const AvailableTimeForAppointmentInTheSameDate = await repository.findOne({
        where: [
            { start: Between(start, end), from_user_id: fromUserId },
            { end: Between(start, end), from_user_id: fromUserId },
        ],
    });

    if (!!AvailableTimeForAppointmentInTheSameDate) {
        throw new AppError(
            'The selected time interval is already marked as available',
        );
    }
}
