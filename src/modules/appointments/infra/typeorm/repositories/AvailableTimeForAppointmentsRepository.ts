import IAvailableTimeForAppointmentsRepository from '@modules/appointments/repositories/IAvailableTimeForAppointmentsRepository';

import IFindAvailableTimeFromUserBetweenDatesDTO from '@modules/appointments/dtos/IFindAvailableTimeFromUserBetweenDatesDTO';
import ICreateAvailableTimeForAppointmentsDTO from '@modules/appointments/dtos/ICreateAvailableTimeForAppointmentsDTO';
import IFindAllAvailableTimeFromUserIdDTO from '@modules/appointments/dtos/IFindAllAvailableTimeFromUserIdDTO';
import IFindAvailableTimeByIdDTO from '@modules/appointments/dtos/IFindAvailableTimeByIdDTO';

import { getRepository, Repository, Between } from 'typeorm';

import AvailableTimeForAppointments from '@modules/appointments/infra/typeorm/entities/AvailableTimeForAppointments';

export default class AvailableTimeForAppointmentsRepository
    implements IAvailableTimeForAppointmentsRepository {
    private ormRepository: Repository<AvailableTimeForAppointments>;

    constructor() {
        this.ormRepository = getRepository(AvailableTimeForAppointments);
    }

    public async create({
        start,
        end,
        fromUserId,
    }: ICreateAvailableTimeForAppointmentsDTO): Promise<
        AvailableTimeForAppointments
    > {
        const appointment = this.ormRepository.create({
            start,
            end,
            from_user_id: fromUserId,
        });

        await this.ormRepository.save(appointment);

        return appointment;
    }

    public async findAllFromUserId({
        userId,
    }: IFindAllAvailableTimeFromUserIdDTO): Promise<
        AvailableTimeForAppointments[] | undefined
    > {
        const availableTimes = await this.ormRepository.find({
            where: { from_user_id: userId },
        });

        return availableTimes;
    }

    public async findById({
        availableTimeId,
    }: IFindAvailableTimeByIdDTO): Promise<
        AvailableTimeForAppointments | undefined
    > {
        const availableTimes = await this.ormRepository.findOne({
            where: { id: availableTimeId },
        });

        return availableTimes;
    }

    public async findAvailableTimeFromUserBetweenDates({
        fromUserId,
        start,
        end,
    }: IFindAvailableTimeFromUserBetweenDatesDTO): Promise<
        AvailableTimeForAppointments | undefined
    > {
        const availableTimesInTheSameDate = await this.ormRepository.findOne({
            where: [
                { from_user_id: fromUserId, start: Between(start, end) },
                { from_user_id: fromUserId, end: Between(start, end) },
            ],
        });

        return availableTimesInTheSameDate;
    }
}
