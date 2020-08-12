import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IBookAppointmentDTO from '@modules/appointments/dtos/IBookAppointmentDTO';
import IFindAppointmentBetweenDatesForAvailableTimeDTO from '@modules/appointments/dtos/IFindAppointmentBetweenDatesForAvailableTimeDTO';
import IFindAppointmentBetweenDatesForUserDTO from '@modules/appointments/dtos/IFindAppointmentBetweenDatesForUserDTO';
import IFindAllAppointmentsForUserIdDTO from '@modules/appointments/dtos/IFindAllAppointmentsForUserIdDTO';
import IAllAppointmentsForUserId from '@modules/appointments/dtos/IAllAppointmentsForUserId';

import {
    getRepository,
    Repository,
    Between,
    MoreThanOrEqual,
    LessThanOrEqual,
} from 'typeorm';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

export default class AppointmentsRepository implements IAppointmentsRepository {
    private ormRepository: Repository<Appointment>;

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async create({
        fromAvailableTimeId,
        forUserId,
        start,
        end,
    }: IBookAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({
            from_available_time_id: fromAvailableTimeId,
            for_user_id: forUserId,
            start,
            end,
        });

        await this.ormRepository.save(appointment);

        return appointment;
    }

    public async findAppointmentBetweenDatesForAvailableTime({
        availableTimeForAppointmentId,
        start,
        end,
    }: IFindAppointmentBetweenDatesForAvailableTimeDTO): Promise<
        Appointment | undefined
    > {
        const bookedAppointmentsInAvailableTime = await this.ormRepository.findOne(
            {
                where: [
                    {
                        start: Between(start, end),
                        from_available_time_id: availableTimeForAppointmentId,
                    },
                    {
                        end: Between(start, end),
                        from_available_time_id: availableTimeForAppointmentId,
                    },
                    {
                        from_available_time_id: availableTimeForAppointmentId,
                        start: LessThanOrEqual(start),
                        end: MoreThanOrEqual(end),
                    },
                ],
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
        const bookedAppointmentsBetweenDates = await this.ormRepository.findOne(
            {
                where: [
                    {
                        for_user_id: forUserId,
                        start: Between(start, end),
                    },
                    {
                        for_user_id: forUserId,
                        end: Between(start, end),
                    },
                    {
                        for_user_id: forUserId,
                        start: LessThanOrEqual(start),
                        end: MoreThanOrEqual(end),
                    },
                ],
            },
        );

        return bookedAppointmentsBetweenDates;
    }

    public async findAllForUserId({
        userId,
    }: IFindAllAppointmentsForUserIdDTO): Promise<IAllAppointmentsForUserId> {
        const appointmentsAsClient = await this.ormRepository.find({
            where: [{ for_user_id: userId }],
        });

        const appointmentsAsServiceProvider = await this.ormRepository
            .createQueryBuilder('appointments')
            .innerJoinAndSelect(
                'appointments.AppointmentFromAvailableTime',
                'available_time_for_appointments',
            )
            .where('available_time_for_appointments.from_user_id = :id', {
                id: `${userId}`,
            })
            .getMany();

        const bookedAppointments = {
            appointmentsAsClient,
            appointmentsAsServiceProvider,
        };

        return bookedAppointments;
    }
}
