import AvailableTimeForAppointments from '@modules/appointments/infra/typeorm/entities/AvailableTimeForAppointments';
import ICreateAvailableTimeForAppointmentsDTO from '@modules/appointments/dtos/ICreateAvailableTimeForAppointmentsDTO';
import IFindAvailableTimeFromUserBetweenDatesDTO from '@modules/appointments/dtos/IFindAvailableTimeFromUserBetweenDatesDTO';

export default interface IAvailableTimeForAppointmentsRepository {
    create(
        data: ICreateAvailableTimeForAppointmentsDTO,
    ): Promise<AvailableTimeForAppointments>;

    findAvailableTimeFromUserBetweenDates(
        dates: IFindAvailableTimeFromUserBetweenDatesDTO,
    ): Promise<AvailableTimeForAppointments | undefined>;
}
