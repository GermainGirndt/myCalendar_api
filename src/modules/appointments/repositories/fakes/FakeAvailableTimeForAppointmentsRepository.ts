import IAvailableTimeForAppointmentsRepository from '@modules/appointments/repositories/IAvailableTimeForAppointmentsRepository';

import IFindAvailableTimeFromUserBetweenDatesDTO from '@modules/appointments/dtos/IFindAvailableTimeFromUserBetweenDatesDTO';
import ICreateAvailableTimeForAppointmentsDTO from '@modules/appointments/dtos/ICreateAvailableTimeForAppointmentsDTO';
import IFindAllAvailableTimeFromUserIdDTO from '@modules/appointments/dtos/IFindAllAvailableTimeFromUserIdDTO';
import IFindAvailableTimeByIdDTO from '@modules/appointments/dtos/IFindAvailableTimeByIdDTO';

import AvailableTimeForAppointments from '@modules/appointments/infra/typeorm/entities/AvailableTimeForAppointments';

import { uuid } from 'uuidv4';

export default class FakeAvailableTimeForAppointmentsRepository
    implements IAvailableTimeForAppointmentsRepository {
    private fakeAvailableTimeRepository: AvailableTimeForAppointments[] = [];

    public async create({
        start,
        end,
        fromUserId,
    }: ICreateAvailableTimeForAppointmentsDTO): Promise<
        AvailableTimeForAppointments
    > {
        const availableTime = new AvailableTimeForAppointments();

        Object.assign(availableTime, {
            id: uuid(),
            start,
            end,
            from_user_id: fromUserId,
        });

        this.fakeAvailableTimeRepository.push(availableTime);

        return availableTime;
    }

    public async findAllFromUserId({
        userId,
    }: IFindAllAvailableTimeFromUserIdDTO): Promise<
        AvailableTimeForAppointments[] | undefined
    > {
        const availableTimeForUser = this.fakeAvailableTimeRepository.filter(
            availableTime => availableTime.from_user_id === userId,
        );

        return availableTimeForUser;
    }

    public async findById({
        availableTimeId,
    }: IFindAvailableTimeByIdDTO): Promise<
        AvailableTimeForAppointments | undefined
    > {
        const availableTimes = await this.fakeAvailableTimeRepository.find(
            availableTime => availableTime.id === availableTimeId,
        );

        return availableTimes;
    }

    public async findAvailableTimeFromUserBetweenDates({
        fromUserId,
        start,
        end,
    }: IFindAvailableTimeFromUserBetweenDatesDTO): Promise<
        AvailableTimeForAppointments | undefined
    > {
        const availableTimesInTheSameDate = await this.fakeAvailableTimeRepository.find(
            availableTime => {
                const matchUserId = availableTime.from_user_id === fromUserId;
                const matchStart =
                    availableTime.start <= start && availableTime.end >= start;
                const matchEnd =
                    availableTime.start <= end && availableTime.end >= end;

                return matchUserId && (matchStart || matchEnd);
            },
        );

        return availableTimesInTheSameDate;
    }
}
