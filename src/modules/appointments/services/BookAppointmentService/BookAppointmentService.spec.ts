import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import FakeAvailableTimeForAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAvailableTimeForAppointmentsRepository';
import FakeAppointmentsRepoistory from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import CreateAvailableTimeForAppointmentsService from '@modules/appointments/services/CreateAvailableTimeForAppointmentsService';
import BookAppointmentService from '@modules/appointments/services/BookAppointmentService';

import { uuid } from 'uuidv4';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeAvailableTimeForAppointmentsRepository: FakeAvailableTimeForAppointmentsRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepoistory;

let createAvailableTimeForAppointmentsService: CreateAvailableTimeForAppointmentsService;
let bookAppointmentService: BookAppointmentService;

let startTimestamp: Date;
let endTimestamp: Date;

describe('Create Available Time For Appointment', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeAvailableTimeForAppointmentsRepository = new FakeAvailableTimeForAppointmentsRepository();
        fakeAppointmentsRepository = new FakeAppointmentsRepoistory();

        createAvailableTimeForAppointmentsService = new CreateAvailableTimeForAppointmentsService(
            fakeAvailableTimeForAppointmentsRepository,
        );

        bookAppointmentService = new BookAppointmentService(
            fakeAppointmentsRepository,
            fakeAvailableTimeForAppointmentsRepository,
        );
    });

    it('should be able to book an appointment', async () => {
        const serviceProvider = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const customer = await fakeUsersRepository.create({
            email: 'customer@example.com',
            forename: 'customer',
            surname: 'cash',
            password: '987654321',
        });

        const now = new Date();

        startTimestamp = new Date(new Date().setHours(now.getHours() + 1));
        endTimestamp = new Date(new Date().setHours(now.getHours() + 2));

        const availableTimeForAppointments = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp,
                end: endTimestamp,
                fromUserId: serviceProvider.id,
            },
        );

        expect(availableTimeForAppointments.start).toBe(startTimestamp);
        expect(availableTimeForAppointments.end).toBe(endTimestamp);

        const appointment = await bookAppointmentService.execute({
            start: startTimestamp,
            end: endTimestamp,
            fromAvailableTimeId: availableTimeForAppointments.id,
            forUserId: customer.id,
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.start).toBe(startTimestamp);
    });

    it('should not be able to book an appointment with an invalid start date', async () => {
        const serviceProvider = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const customer = await fakeUsersRepository.create({
            email: 'customer@example.com',
            forename: 'customer',
            surname: 'cash',
            password: '987654321',
        });

        const now = new Date();

        startTimestamp = new Date(new Date().setHours(now.getHours() + 1));
        endTimestamp = new Date(new Date().setHours(now.getHours() + 2));

        const availableTimeForAppointments = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp,
                end: endTimestamp,
                fromUserId: serviceProvider.id,
            },
        );

        expect(availableTimeForAppointments.start).toBe(startTimestamp);
        expect(availableTimeForAppointments.end).toBe(endTimestamp);

        const invalidStartTimeStamp = ('' as unknown) as Date;

        await expect(
            bookAppointmentService.execute({
                start: invalidStartTimeStamp,
                end: endTimestamp,
                fromAvailableTimeId: availableTimeForAppointments.id,
                forUserId: customer.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to book an appointment with an invalid end date', async () => {
        const serviceProvider = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const customer = await fakeUsersRepository.create({
            email: 'customer@example.com',
            forename: 'customer',
            surname: 'cash',
            password: '987654321',
        });

        const now = new Date();

        startTimestamp = new Date(new Date().setHours(now.getHours() + 1));
        endTimestamp = new Date(new Date().setHours(now.getHours() + 2));

        const availableTimeForAppointments = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp,
                end: endTimestamp,
                fromUserId: serviceProvider.id,
            },
        );

        expect(availableTimeForAppointments.start).toBe(startTimestamp);
        expect(availableTimeForAppointments.end).toBe(endTimestamp);

        const invalidEndTimeStamp = ('' as unknown) as Date;

        await expect(
            bookAppointmentService.execute({
                start: startTimestamp,
                end: invalidEndTimeStamp,
                fromAvailableTimeId: availableTimeForAppointments.id,
                forUserId: customer.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to book an appointment with start date in the past', async () => {
        const serviceProvider = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const customer = await fakeUsersRepository.create({
            email: 'customer@example.com',
            forename: 'customer',
            surname: 'cash',
            password: '987654321',
        });

        const now = new Date();

        startTimestamp = new Date(new Date().setHours(now.getHours() + 1));
        endTimestamp = new Date(new Date().setHours(now.getHours() + 2));

        const availableTimeForAppointments = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp,
                end: endTimestamp,
                fromUserId: serviceProvider.id,
            },
        );

        expect(availableTimeForAppointments.start).toBe(startTimestamp);
        expect(availableTimeForAppointments.end).toBe(endTimestamp);

        const startTimestampInThePast = new Date(
            new Date().setHours(now.getHours() - 2),
        );

        await expect(
            bookAppointmentService.execute({
                start: startTimestampInThePast,
                end: endTimestamp,
                fromAvailableTimeId: availableTimeForAppointments.id,
                forUserId: customer.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to book an appointment with end date in the past', async () => {
        const serviceProvider = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const customer = await fakeUsersRepository.create({
            email: 'customer@example.com',
            forename: 'customer',
            surname: 'cash',
            password: '987654321',
        });

        const now = new Date();

        startTimestamp = new Date(new Date().setHours(now.getHours() + 1));
        endTimestamp = new Date(new Date().setHours(now.getHours() + 2));

        const availableTimeForAppointments = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp,
                end: endTimestamp,
                fromUserId: serviceProvider.id,
            },
        );

        expect(availableTimeForAppointments.start).toBe(startTimestamp);
        expect(availableTimeForAppointments.end).toBe(endTimestamp);

        const endTimestampInThePast = new Date(
            new Date().setHours(now.getHours() - 2),
        );

        await expect(
            bookAppointmentService.execute({
                start: startTimestamp,
                end: endTimestampInThePast,
                fromAvailableTimeId: availableTimeForAppointments.id,
                forUserId: customer.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to book an appointment with an invalid customer id', async () => {
        const serviceProvider = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const customer = await fakeUsersRepository.create({
            email: 'customer@example.com',
            forename: 'customer',
            surname: 'cash',
            password: '987654321',
        });

        const now = new Date();

        startTimestamp = new Date(new Date().setHours(now.getHours() + 1));
        endTimestamp = new Date(new Date().setHours(now.getHours() + 2));

        const availableTimeForAppointments = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp,
                end: endTimestamp,
                fromUserId: serviceProvider.id,
            },
        );

        expect(availableTimeForAppointments.start).toBe(startTimestamp);
        expect(availableTimeForAppointments.end).toBe(endTimestamp);

        await expect(
            bookAppointmentService.execute({
                start: startTimestamp,
                end: endTimestamp,
                fromAvailableTimeId: availableTimeForAppointments.id,
                forUserId: 'invalid customer id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to book an appointment for invalid id', async () => {
        await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const customer = await fakeUsersRepository.create({
            email: 'customer@example.com',
            forename: 'customer',
            surname: 'cash',
            password: '987654321',
        });

        const now = new Date();

        startTimestamp = new Date(new Date().setHours(now.getHours() + 1));
        endTimestamp = new Date(new Date().setHours(now.getHours() + 2));

        await expect(
            bookAppointmentService.execute({
                start: startTimestamp,
                end: endTimestamp,
                fromAvailableTimeId: 'invalid id',
                forUserId: customer.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to book an appointment to a time not set as available', async () => {
        const serviceProvider = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const customer = await fakeUsersRepository.create({
            email: 'customer@example.com',
            forename: 'customer',
            surname: 'cash',
            password: '987654321',
        });

        const now = new Date();

        startTimestamp = new Date(new Date().setHours(now.getHours() + 1));
        endTimestamp = new Date(new Date().setHours(now.getHours() + 2));

        const availableTimeForAppointments = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp,
                end: endTimestamp,
                fromUserId: serviceProvider.id,
            },
        );

        expect(availableTimeForAppointments.start).toBe(startTimestamp);
        expect(availableTimeForAppointments.end).toBe(endTimestamp);

        const invalidStartTimeStamp = new Date(
            new Date().setHours(now.getHours() + 2),
        );
        const invalidEndTimeStamp = new Date(
            new Date().setHours(now.getHours() + 3),
        );

        await expect(
            bookAppointmentService.execute({
                start: invalidStartTimeStamp,
                end: invalidEndTimeStamp,
                fromAvailableTimeId: availableTimeForAppointments.id,
                forUserId: customer.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to book an appointment in time interval already booked', async () => {
        const serviceProvider = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const customer = await fakeUsersRepository.create({
            email: 'customer@example.com',
            forename: 'customer',
            surname: 'cash',
            password: '987654321',
        });

        const now = new Date();

        startTimestamp = new Date(new Date().setHours(now.getHours() + 1));
        endTimestamp = new Date(new Date().setHours(now.getHours() + 2));

        const availableTimeForAppointments = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp,
                end: endTimestamp,
                fromUserId: serviceProvider.id,
            },
        );

        expect(availableTimeForAppointments.start).toBe(startTimestamp);
        expect(availableTimeForAppointments.end).toBe(endTimestamp);

        const appointment = await bookAppointmentService.execute({
            start: startTimestamp,
            end: endTimestamp,
            fromAvailableTimeId: availableTimeForAppointments.id,
            forUserId: customer.id,
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.start).toBe(startTimestamp);

        await expect(
            bookAppointmentService.execute({
                start: startTimestamp,
                end: endTimestamp,
                fromAvailableTimeId: availableTimeForAppointments.id,
                forUserId: customer.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to book an appointment when customer has already an booked appointment for this time interval', async () => {
        const serviceProvider = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const serviceProvider2 = await fakeUsersRepository.create({
            email: 'johnsnow@example.com',
            forename: 'John',
            surname: 'Snow',
            password: '123456',
        });

        const customer = await fakeUsersRepository.create({
            email: 'customer@example.com',
            forename: 'customer',
            surname: 'cash',
            password: '987654321',
        });

        const now = new Date();

        startTimestamp = new Date(new Date().setHours(now.getHours() + 1));
        endTimestamp = new Date(new Date().setHours(now.getHours() + 2));

        const availableTimeForAppointments = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp,
                end: endTimestamp,
                fromUserId: serviceProvider.id,
            },
        );

        expect(availableTimeForAppointments.start).toBe(startTimestamp);
        expect(availableTimeForAppointments.end).toBe(endTimestamp);

        const availableTimeForAppointments2 = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp,
                end: endTimestamp,
                fromUserId: serviceProvider2.id,
            },
        );

        const appointment = await bookAppointmentService.execute({
            start: startTimestamp,
            end: endTimestamp,
            fromAvailableTimeId: availableTimeForAppointments.id,
            forUserId: customer.id,
        });
        expect(appointment).toHaveProperty('id');
        expect(appointment.start).toBe(startTimestamp);

        await expect(
            bookAppointmentService.execute({
                start: startTimestamp,
                end: endTimestamp,
                fromAvailableTimeId: availableTimeForAppointments2.id,
                forUserId: customer.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to book an appointment for valid but not existing id', async () => {
        await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const customer = await fakeUsersRepository.create({
            email: 'customer@example.com',
            forename: 'customer',
            surname: 'cash',
            password: '987654321',
        });

        const now = new Date();

        startTimestamp = new Date(new Date().setHours(now.getHours() + 1));
        endTimestamp = new Date(new Date().setHours(now.getHours() + 2));

        await expect(
            bookAppointmentService.execute({
                start: startTimestamp,
                end: endTimestamp,
                fromAvailableTimeId: uuid(),
                forUserId: customer.id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
