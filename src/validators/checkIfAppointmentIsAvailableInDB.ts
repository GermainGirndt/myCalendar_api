import AppError from '../error/AppError';
import { Repository, Between } from 'typeorm';
import AvailableTimeForAppointments from '../models/AvailableTimeForAppointments';

interface ValidationRequestDTO {
    repository: Repository<AvailableTimeForAppointments>;
    start: Date;
    end: Date;
}

export default async function validateIfTimeAvailableInDB({
    repository,
    start,
    end,
}: ValidationRequestDTO): Promise<void> {
    const AvailableTimeForAppointmentInTheSameDate = await repository.findOne({
        where: [{ start: Between(start, end) }, { end: Between(start, end) }],
    });

    console.log('Found:');
    console.log(AvailableTimeForAppointmentInTheSameDate);

    if (!!AvailableTimeForAppointmentInTheSameDate) {
        throw new AppError(
            'The selected time interval is already marked as available',
        );
    }
}
