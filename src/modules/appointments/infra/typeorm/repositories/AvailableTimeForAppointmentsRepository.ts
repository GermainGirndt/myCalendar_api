import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IBookAppointmentDTO from '@modules/appointments/dtos/IBookAppointmentDTO';
import IFindAppointmentBetweenDatesForAvailableTimeDTO from '@modules/appointments/dtos/IFindAppointmentBetweenDatesForAvailableTimeDTO';
import IFindAvailableTimeFromUserBetweenDatesDTO from '@modules/appointments/dtos/IFindAvailableTimeFromUserBetweenDatesDTO';
import { getRepository, Repository, Between } from 'typeorm';
import IAvailableTimeForAppointmentsRepository from '@modules/appointments/repositories/IAvailableTimeForAppointmentsRepository';
import AvailableTimeForAppointments from '@modules/appointments/infra/typeorm/entities/AvailableTimeForAppointments';
import ICreateAvailableTimeForAppointmentsDTO from '@modules/appointments/dtos/ICreateAvailableTimeForAppointmentsDTO';

const availableTimesForAppointmentsRepository = getRepository(
    AvailableTimeForAppointments,
);

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

    public async findAll(
        userId: string,
    ): Promise<AvailableTimeForAppointments[] | undefined> {
        const availableTimes = await this.ormRepository.find({
            where: { from_user_id: userId },
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
                { start: Between(start, end), from_user_id: fromUserId },
                { end: Between(start, end), from_user_id: fromUserId },
            ],
        });

        return availableTimesInTheSameDate;
    }
}
