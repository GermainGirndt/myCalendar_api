import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IBookAppointmentDTO from '@modules/appointments/dtos/Appointments/IBookAppointmentDTO';
import IFindAppointmentBetweenDatesForAvailableTimeDTO from '@modules/appointments/dtos/Appointments/IFindAppointmentBetweenDatesForAvailableTimeDTO';
import IFindAppointmentBetweenDatesForUser from '@modules/appointments/dtos/Appointments/IFindAppointmentBetweenDatesForUserDTO';
import IFindAllAppointmentsForUserIdDTO from '@modules/appointments/dtos/Appointments/IFindAllAppointmentsForUserIdDTO';
import IAllAppointmentsForUserId from '@modules/appointments/dtos/Appointments/IAllAppointmentsForUserId';

export default interface IAppointmentsRepository {
    create(data: IBookAppointmentDTO): Promise<Appointment>;

    findAppointmentBetweenDatesForAvailableTime(
        dates: IFindAppointmentBetweenDatesForAvailableTimeDTO,
    ): Promise<Appointment | undefined>;

    findAppointmentBetweenDatesForUser(
        dates: IFindAppointmentBetweenDatesForUser,
    ): Promise<Appointment | undefined>;

    findAllForUserId({
        userId,
    }: IFindAllAppointmentsForUserIdDTO): Promise<IAllAppointmentsForUserId>;
}
