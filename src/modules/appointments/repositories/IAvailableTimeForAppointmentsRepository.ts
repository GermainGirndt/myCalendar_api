import ICreateAvailableTimeForAppointmentsDTO from '@modules/appointments/dtos/AvailableTime/ICreateAvailableTimeForAppointmentsDTO';
import IFindAvailableTimeFromUserBetweenDatesDTO from '@modules/appointments/dtos/AvailableTime/IFindAvailableTimeFromUserBetweenDatesDTO';
import IFindAvailableTimeFromUserPassingThroughDatesDTO from '@modules/appointments/dtos/AvailableTime/IFindAvailableTimeFromUserPassingThroughDatesDTO';
import IFindAllAvailableTimeFromUserIdDTO from '@modules/appointments/dtos/AvailableTime/IFindAllAvailableTimeFromUserIdDTO';
import IFindAvailableTimeByIdDTO from '@modules/appointments/dtos/AvailableTime/IFindAvailableTimeByIdDTO';

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
