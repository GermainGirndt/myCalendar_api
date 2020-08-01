import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IBookAppointmentDTO from '@modules/appointments/dtos/IBookAppointmentDTO';
import IFindAppointmentBetweenDatesForAvailableTimeDTO from '@modules/appointments/dtos/IFindAppointmentBetweenDatesForAvailableTimeDTO';
import IFindAppointmentBetweenDatesForUser from '@modules/appointments/dtos/IFindAppointmentBetweenDatesForUserDTO';

export default interface IAppointmentsRepository {
    create(data: IBookAppointmentDTO): Promise<Appointment>;

    findAppointmentBetweenDatesForAvailableTime(
        dates: IFindAppointmentBetweenDatesForAvailableTimeDTO,
    ): Promise<Appointment | undefined>;

    findAppointmentBetweenDatesForUser(
        dates: IFindAppointmentBetweenDatesForUser,
    ): Promise<Appointment | undefined>;
}
