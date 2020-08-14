import ICreateAvailableTimeForAppointmentsDTO from '@modules/appointments/dtos/ICreateAvailableTimeForAppointmentsDTO';
import IFindAvailableTimeFromUserBetweenDatesDTO from '@modules/appointments/dtos/IFindAvailableTimeFromUserBetweenDatesDTO';
import IFindAvailableTimeFromUserPassingThroughDatesDTO from '@modules/appointments/dtos/IFindAvailableTimeFromUserPassingThroughDatesDTO';
import IFindAllAvailableTimeFromUserIdDTO from '@modules/appointments/dtos/IFindAllAvailableTimeFromUserIdDTO';
import IFindAvailableTimeByIdDTO from '@modules/appointments/dtos/IFindAvailableTimeByIdDTO';

import AvailableTimeForAppointments from '@modules/appointments/infra/typeorm/entities/AvailableTimeForAppointments';

export default interface IAvailableTimeForAppointmentsRepository {
    create(
        data: ICreateAvailableTimeForAppointmentsDTO,
    ): Promise<AvailableTimeForAppointments>;

    findAllFromUserId({
        userId,
    }: IFindAllAvailableTimeFromUserIdDTO): Promise<
        AvailableTimeForAppointments[]
    >;

    findById({
        availableTimeId,
    }: IFindAvailableTimeByIdDTO): Promise<
        AvailableTimeForAppointments | undefined
    >;

    findAvailableTimeFromUserBetweenDates(
        data: IFindAvailableTimeFromUserBetweenDatesDTO,
    ): Promise<AvailableTimeForAppointments | undefined>;

    findAvailableTimeFromUserPassingThroughDates(
        data: IFindAvailableTimeFromUserPassingThroughDatesDTO,
    ): Promise<AvailableTimeForAppointments | undefined>;
}
