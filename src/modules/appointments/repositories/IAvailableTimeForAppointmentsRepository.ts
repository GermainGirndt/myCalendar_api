import AvailableTimeForAppointments from '@modules/appointments/infra/typeorm/entities/AvailableTimeForAppointments';
import ICreateAvailableTimeForAppointmentsDTO from '@modules/appointments/dtos/ICreateAvailableTimeForAppointmentsDTO';
import IFindAvailableTimeFromUserBetweenDatesDTO from '@modules/appointments/dtos/IFindAvailableTimeFromUserBetweenDatesDTO';
import IFindAllAvailableTimeForUserDTO from '@modules/appointments/dtos/IFindAllAvailableTimeForUserDTO';

export default interface IAvailableTimeForAppointmentsRepository {
    create(
        data: ICreateAvailableTimeForAppointmentsDTO,
    ): Promise<AvailableTimeForAppointments>;

    findAll({
        userId,
    }: IFindAllAvailableTimeForUserDTO): Promise<
        AvailableTimeForAppointments[] | undefined
    >;

    findAvailableTimeFromUserBetweenDates(
        data: IFindAvailableTimeFromUserBetweenDatesDTO,
    ): Promise<AvailableTimeForAppointments | undefined>;
}
