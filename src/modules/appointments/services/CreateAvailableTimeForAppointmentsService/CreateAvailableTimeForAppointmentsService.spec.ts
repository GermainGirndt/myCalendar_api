import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import FakeAvailableTimeForAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAvailableTimeForAppointmentsRepository';
import CreateAvailableTimeForAppointmentsService from '@modules/appointments/services/CreateAvailableTimeForAppointmentsService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeAvailableTimeForAppointmentsRepository: FakeAvailableTimeForAppointmentsRepository;
let createAvailableTimeForAppointmentsService: CreateAvailableTimeForAppointmentsService;

let startTimestamp: Date;
let endTimestamp: Date;

let startTimestamp2: Date;
let endTimestamp2: Date;

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

        startTimestamp = new Date();
        endTimestamp = new Date(
            new Date().setHours(startTimestamp.getHours() + 1),
        );

        const availableTimeForAppointments = await createAvailableTimeForAppointmentsService.execute(
            { start: startTimestamp, end: endTimestamp, fromUserId: user.id },
        );

        expect(availableTimeForAppointments.start).toBe(startTimestamp);
        expect(availableTimeForAppointments.end).toBe(endTimestamp);
    });

    it('should be able to create two available times for appointment', async () => {
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

        startTimestamp2 = new Date(
            new Date().setHours(
                endTimestamp.getHours(),
                endTimestamp.getMinutes() + 1,
            ),
        );

        endTimestamp2 = new Date(
            new Date().setHours(startTimestamp2.getHours() + 1),
        );

        const availableTimeForAppointments = await createAvailableTimeForAppointmentsService.execute(
            { start: startTimestamp, end: endTimestamp, fromUserId: user.id },
        );

        const availableTimeForAppointments2 = await createAvailableTimeForAppointmentsService.execute(
            { start: startTimestamp2, end: endTimestamp2, fromUserId: user.id },
        );

        expect(availableTimeForAppointments.start).toBe(startTimestamp);
        expect(availableTimeForAppointments.end).toBe(endTimestamp);

        expect(availableTimeForAppointments2.start).toBe(startTimestamp2);
        expect(availableTimeForAppointments2.end).toBe(endTimestamp2);
    });

    it('should not be able to create an available time for appointment in the past', async () => {
        const user = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const startTimestamp = new Date('2019-01-10T10:00:01');
        const endTimestamp = new Date('2020-01-10T11:00:00');

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

        const start = '2025-01-10T10:00:01';
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

    it('should not be able to create a available time with a invalid start date', async () => {
        const user = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const now = new Date();

        startTimestamp = ('' as unknown) as Date;

        endTimestamp = new Date(new Date().setHours(now.getHours() + 1));

        await expect(
            createAvailableTimeForAppointmentsService.execute({
                start: startTimestamp,
                end: endTimestamp,
                fromUserId: user.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a available time with a invalid end date', async () => {
        const user = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const now = new Date();

        startTimestamp = now;

        endTimestamp = ('' as unknown) as Date;

        await expect(
            createAvailableTimeForAppointmentsService.execute({
                start: startTimestamp,
                end: endTimestamp,
                fromUserId: user.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create a available time that ends before the start', async () => {
        const user = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const now = new Date();
        startTimestamp = new Date(new Date().setHours(now.getHours() + 2));

        endTimestamp = new Date(
            new Date().setHours(startTimestamp.getHours() - 1),
        );

        await expect(
            createAvailableTimeForAppointmentsService.execute({
                start: startTimestamp,
                end: endTimestamp,
                fromUserId: user.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an available time with an invalid user id', async () => {
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

        await expect(
            createAvailableTimeForAppointmentsService.execute({
                start: startTimestamp,
                end: endTimestamp,
                fromUserId: 'invalid user id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create two available times for appointments within same date', async () => {
        const user = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const start = '2025-01-10T10:00:01';
        const end = '2025-01-10T11:00:00';

        const start2 = '2025-01-10T10:30:01';
        const end2 = '2025-01-10T12:00:00';

        const startTimestamp = new Date(start);
        const endTimestamp = new Date(end);

        const startTimestamp2 = new Date(start2);
        const endTimestamp2 = new Date(end2);

        const availableTimeForAppointments = await createAvailableTimeForAppointmentsService.execute(
            { start: startTimestamp, end: endTimestamp, fromUserId: user.id },
        );

        expect(availableTimeForAppointments.start).toBe(startTimestamp);
        expect(availableTimeForAppointments.end).toBe(endTimestamp);

        await expect(
            createAvailableTimeForAppointmentsService.execute({
                start: startTimestamp2,
                end: endTimestamp2,
                fromUserId: user.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
