import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IBookAppointmentDTO from '@modules/appointments/dtos/IBookAppointmentDTO';
import IFindAppointmentBetweenDatesForAvailableTimeDTO from '@modules/appointments/dtos/IFindAppointmentBetweenDatesForAvailableTimeDTO';
import IFindAppointmentBetweenDatesForUserDTO from '@modules/appointments/dtos/IFindAppointmentBetweenDatesForUserDTO';
import IFindAllAppointmentsForUserIdDTO from '@modules/appointments/dtos/IFindAllAppointmentsForUserIdDTO';
import IAllAppointmentsForUserId from '@modules/appointments/dtos/IAllAppointmentsForUserId';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IAvailableTimeForAppointmentsRepository from '@modules/appointments/repositories/IAvailableTimeForAppointmentsRepository';

import { uuid } from 'uuidv4';
import AvailableTime from '@modules/appointments/infra/typeorm/entities/AvailableTimeForAppointments';

export default class FakeAppointmentsRepository
    implements IAppointmentsRepository {
    private fakeAppointmentsRepository: Appointment[] = [];
    private fakeAvailableTimeForAppointmentsRepository: Array<
        AvailableTime
    > = [];

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
                const matchAvailableTimeId =
                    appointment.from_available_time_id ===
                    availableTimeForAppointmentId;
                const matchStart =
                    appointment.start <= start && appointment.end >= start;
                const matchMiddle =
                    appointment.start <= start && appointment.end >= end;
                const matchEnd =
                    appointment.start <= end && appointment.end >= end;

                return (
                    matchAvailableTimeId &&
                    (matchStart || matchMiddle || matchEnd)
                );
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
        // return true if appointments repository contains
        // any common point between start/end dates
        const bookedAppointmentsBetweenDates = await this.fakeAppointmentsRepository.find(
            appointment => {
                const matchUserId = appointment.for_user_id === forUserId;
                const matchStart =
                    appointment.start <= start && appointment.end >= start;
                const matchMiddle =
                    appointment.start <= start && appointment.end >= end;
                const matchEnd =
                    appointment.start <= end && appointment.end >= end;

                return matchUserId && (matchStart || matchMiddle || matchEnd);
            },
        );

        return bookedAppointmentsBetweenDates;
    }

    public async findAllForUserId({
        userId,
    }: IFindAllAppointmentsForUserIdDTO): Promise<IAllAppointmentsForUserId> {
        // Note: Remember to use the connect repo class method

        // get the appointments as client
        const appointmentsAsClient = await this.fakeAppointmentsRepository.filter(
            appointment => {
                return appointment.for_user_id === userId;
            },
        );

        // get the appointments as service providers in 3 parts:
        const appointmentsAsServiceProvider: Appointment[] = [];

        // part 1 - searches another repository for
        // available times as service provider
        await this.fakeAvailableTimeForAppointmentsRepository.forEach(
            availableTime => {
                if (availableTime.from_user_id === userId) {
                    // part 2 - if found, searches the original appointments
                    // repository for the corresponding booking
                    const appointmentAsServiceProvider = this.fakeAppointmentsRepository.find(
                        appointment => {
                            return (
                                appointment.from_available_time_id ===
                                availableTime.id
                            );
                        },
                    );

                    // part 3 - if exists, pushes it into the array
                    if (appointmentAsServiceProvider) {
                        appointmentsAsServiceProvider.push(
                            appointmentAsServiceProvider,
                        );
                    }
                }
            },
        );

        const allAppointments = {
            appointmentsAsClient,
            appointmentsAsServiceProvider,
        };

        return allAppointments;
    }

    public registerAvailableTime(availableTime: AvailableTime) {
        this.fakeAvailableTimeForAppointmentsRepository.push(availableTime);
    }
}
