import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import FakeAvailableTimeForAppointmentsRepository from './../repositories/fakes/FakeAvailableTimeForAppointmentsRepository';

import CreateAvailableTimeForAppointmentsService from './CreateAvailableTimeForAppointmentsService';
import FindAvailableTimeForUserService from './FindAvailableTimeForUserService';
import AppError from '@shared/errors/AppError';
import AvailableTime from '../infra/typeorm/entities/AvailableTimeForAppointments';

let fakeUsersRepository: FakeUsersRepository;
let fakeAvailableTimeForAppointmentsRepository: FakeAvailableTimeForAppointmentsRepository;
let createAvailableTimeForAppointmentsService: CreateAvailableTimeForAppointmentsService;
let findAvailableTimeForUserService: FindAvailableTimeForUserService;

let startTimestamp: Date;
let endTimestamp: Date;

describe('Create Available Time For Appointment', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeAvailableTimeForAppointmentsRepository = new FakeAvailableTimeForAppointmentsRepository();

        createAvailableTimeForAppointmentsService = new CreateAvailableTimeForAppointmentsService(
            fakeAvailableTimeForAppointmentsRepository,
        );

        findAvailableTimeForUserService = new FindAvailableTimeForUserService(
            fakeAvailableTimeForAppointmentsRepository,
        );
    });

    it('should be able to find an available time', async () => {
        const user = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        startTimestamp = new Date();
        endTimestamp = new Date(
            new Date().setHours(startTimestamp.getHours() + 1),
        );

        const availableTimeForAppointments = await createAvailableTimeForAppointmentsService.execute(
            { start: startTimestamp, end: endTimestamp, fromUserId: user.id },
        );

        const availableTime = (await findAvailableTimeForUserService.execute({
            userId: user.id,
        })) as AvailableTime[];

        expect(availableTimeForAppointments.start).toBe(startTimestamp);
        expect(availableTimeForAppointments.end).toBe(endTimestamp);

        expect(availableTime).toHaveLength(1);
        expect(availableTime[0].start).toBe(startTimestamp);
        expect(availableTime[0].end).toBe(endTimestamp);
    });

    it('should not be able to find an unexisting available time', async () => {
        const user = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const availableTime = await findAvailableTimeForUserService.execute({
            userId: user.id,
        });

        expect(availableTime).toBeDefined();
        expect(availableTime).toHaveLength(0);
    });
});
