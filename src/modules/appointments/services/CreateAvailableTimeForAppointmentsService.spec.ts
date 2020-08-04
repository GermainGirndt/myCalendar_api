import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import FakeAvailableTimeForAppointmentsRepository from './../repositories/fakes/FakeAvailableTimeForAppointmentsRepository';
import CreateAvailableTimeForAppointmentsService from './CreateAvailableTimeForAppointmentsService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeAvailableTimeForAppointmentsRepository: FakeAvailableTimeForAppointmentsRepository;
let createAvailableTimeForAppointmentsService: CreateAvailableTimeForAppointmentsService;

describe('Create Available Time For Appointment', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeAvailableTimeForAppointmentsRepository = new FakeAvailableTimeForAppointmentsRepository();
        createAvailableTimeForAppointmentsService = new CreateAvailableTimeForAppointmentsService(
            fakeAvailableTimeForAppointmentsRepository,
        );
    });

    it('should be able to create an available time for appointment', async () => {
        const user = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const start = '2025-01-10T10:00:00';
        const end = '2025-01-10T11:00:00';

        const startTimestamp = new Date(start);
        const endTimestamp = new Date(end);

        const availableTimeForAppointments = await createAvailableTimeForAppointmentsService.execute(
            { start: startTimestamp, end: endTimestamp, fromUserId: user.id },
        );

        expect(availableTimeForAppointments.start).toBe(startTimestamp);
        expect(availableTimeForAppointments.end).toBe(endTimestamp);
    });

    it('should not be able to create an available time for appointment in the past', async () => {
        const user = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const start = '2019-01-10T10:00:00';
        const end = '2020-01-10T11:00:00';

        const startTimestamp = new Date(start);
        const endTimestamp = new Date(end);

        await expect(
            createAvailableTimeForAppointmentsService.execute({
                start: startTimestamp,
                end: endTimestamp,
                fromUserId: user.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create two available times in the same date', async () => {
        const user = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const start = '2025-01-10T10:00:00';
        const end = '2025-01-10T11:00:00';

        const startTimestamp = new Date(start);
        const endTimestamp = new Date(end);

        await createAvailableTimeForAppointmentsService.execute({
            start: startTimestamp,
            end: endTimestamp,
            fromUserId: user.id,
        });

        await expect(
            createAvailableTimeForAppointmentsService.execute({
                start: startTimestamp,
                end: endTimestamp,
                fromUserId: user.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
