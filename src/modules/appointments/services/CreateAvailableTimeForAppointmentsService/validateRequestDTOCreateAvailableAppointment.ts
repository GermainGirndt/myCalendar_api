import ICreateAvailableTimeForAppointmentsDTO from '@modules/appointments/dtos/AvailableTime/ICreateAvailableTimeForAppointmentsDTO';

import { isBefore } from 'date-fns';
import { isUuid } from 'uuidv4';

import AppError from '@shared/errors/AppError';

export default function validateRequestDTOCreateAvailableTime({
    start,
    end,
    fromUserId,
}: ICreateAvailableTimeForAppointmentsDTO): void {
    const now = new Date();

    if (Object.prototype.toString.call(start) !== '[object Date]' || !start) {
        throw new AppError('Please insert a valid appointment start date');
    } else if (
        Object.prototype.toString.call(end) !== '[object Date]' ||
        !end
    ) {
        throw new AppError('Please insert a valid appointment end date');
    } else if (isBefore(start, now)) {
        throw new AppError('The start date may not be in the past');
    } else if (isBefore(end, start)) {
        throw new AppError('The start date must come before the end date');
    } else if (!isUuid(fromUserId)) {
        throw new AppError('Please insert a valid user id');
    }
}
