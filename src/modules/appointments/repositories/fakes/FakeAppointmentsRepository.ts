import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IBookAppointmentDTO from '@modules/appointments/dtos/IBookAppointmentDTO';
import IFindAppointmentBetweenDatesForAvailableTimeDTO from '@modules/appointments/dtos/IFindAppointmentBetweenDatesForAvailableTimeDTO';
import IFindAppointmentBetweenDatesForUserDTO from '@modules/appointments/dtos/IFindAppointmentBetweenDatesForUserDTO';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import { uuid } from 'uuidv4';

export default class FakeAppointmentsRepository
    implements IAppointmentsRepository {
    private fakeAppointmentsRepository: Appointment[] = [];

    public async create({
        fromAvailableTimeId,
        forUserId,
        start,
        end,
    }: IBookAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        Object.assign(appointment, {
            id: uuid(),
            from_available_time_id: fromAvailableTimeId,
            for_user_id: forUserId,
            start,
            end,
        });

        this.fakeAppointmentsRepository.push(appointment);

        return appointment;
    }

    public async findAppointmentBetweenDatesForAvailableTime({
        availableTimeForAppointmentId,
        start,
        end,
    }: IFindAppointmentBetweenDatesForAvailableTimeDTO): Promise<
        Appointment | undefined
    > {
        const bookedAppointmentsInAvailableTime = await this.fakeAppointmentsRepository.find(
            appointment => {
                const matchUserId =
                    appointment.from_available_time_id ===
                    availableTimeForAppointmentId;
                const matchStart =
                    appointment.start <= start && appointment.end >= start;
                const matchEnd =
                    appointment.start <= end && appointment.end >= end;

                return matchUserId && (matchStart || matchEnd);
            },
        );

        return bookedAppointmentsInAvailableTime;
    }

    public async findAppointmentBetweenDatesForUser({
        forUserId,
        start,
        end,
    }: IFindAppointmentBetweenDatesForUserDTO): Promise<
        Appointment | undefined
    > {
        const bookedAppointmentsBetweenDates = await this.fakeAppointmentsRepository.find(
            appointment => {
                const matchUserId = appointment.for_user_id === forUserId;
                const matchStart =
                    appointment.start <= start && appointment.end >= start;
                const matchEnd =
                    appointment.start <= end && appointment.end >= end;

                return matchUserId && (matchStart || matchEnd);
            },
        );

        return bookedAppointmentsBetweenDates;
    }
}
