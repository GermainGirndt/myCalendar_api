import IAvailableTimeForAppointmentsRepository from '@modules/appointments/repositories/IAvailableTimeForAppointmentsRepository';

import IFindAvailableTimeFromUserBetweenDatesDTO from '@modules/appointments/dtos/IFindAvailableTimeFromUserBetweenDatesDTO';
import IFindAvailableTimeFromUserPassingThroughDatesDTO from '@modules/appointments/dtos/IFindAvailableTimeFromUserPassingThroughDatesDTO';
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
        // return true if the available time repository
        // completly contain the start and end values
        const availableTimesInTheSameDate = await this.fakeAvailableTimeRepository.find(
            availableTime => {
                const matchUserId = availableTime.from_user_id === fromUserId;
                const matchStart = availableTime.start <= start;
                const matchEnd = availableTime.end >= end;

                return matchUserId && matchStart && matchEnd;
            },
        );

        return availableTimesInTheSameDate;
    }

    public async findAvailableTimeFromUserPassingThroughDates({
        fromUserId,
        start,
        end,
    }: IFindAvailableTimeFromUserPassingThroughDatesDTO): Promise<
        AvailableTimeForAppointments | undefined
    > {
        // return true if availabletime repository contains
        // any common point between start/end dates
        const availableTimesInTheSameDate = await this.fakeAvailableTimeRepository.find(
            availableTime => {
                const matchUserId = availableTime.from_user_id === fromUserId;
                const matchStart =
                    availableTime.start >= start && availableTime.start <= end;
                const matchMiddle =
                    availableTime.start <= start && availableTime.end >= end;
                const matchEnd =
                    availableTime.end >= start && availableTime.end <= end;

                return matchUserId && (matchStart || matchMiddle || matchEnd);
            },
        );

        return availableTimesInTheSameDate;
    }
}
