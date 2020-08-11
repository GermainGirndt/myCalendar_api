import IBookAppointmentDTO from '@modules/appointments/dtos/IBookAppointmentDTO';

import { isValid, isBefore } from 'date-fns';
import { isUuid } from 'uuidv4';

import AppError from '@shared/errors/AppError';

export default function validateRequestDTOBookAppointment({
    fromAvailableTimeId,
    forUserId,
    start,
    end,
}: IBookAppointmentDTO): void {
    if (Object.prototype.toString.call(start) !== '[object Date]' || !start) {
        throw new AppError('Please insert a valid appointment start date');
    } else if (
        Object.prototype.toString.call(end) !== '[object Date]' ||
        !end
    ) {
        throw new AppError('Please insert a valid appointment end date');
    } else if (isBefore(start, Date.now())) {
        throw new AppError('The start date may not be in the past');
    } else if (isBefore(end, start)) {
        throw new AppError('The start date must come before the end date');
    } else if (!isUuid(forUserId)) {
        throw new AppError('Please insert a valid customer id');
    } else if (!isUuid(fromAvailableTimeId)) {
        throw new AppError('Please insert a valid available appointment id');
    }
}
