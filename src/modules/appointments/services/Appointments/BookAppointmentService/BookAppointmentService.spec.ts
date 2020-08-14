import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import FakeAvailableTimeForAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAvailableTimeForAppointmentsRepository';
import FakeAppointmentsRepoistory from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import CreateAvailableTimeForAppointmentsService from '@modules/appointments/services/AvailableTime/CreateAvailableTimeForAppointmentsService';
import BookAppointmentService from '@modules/appointments/services/Appointments/BookAppointmentService';

import User from '@modules/users/infra/typeorm/entities/User';

import { uuid } from 'uuidv4';

import AppError from '@shared/errors/AppError';
import AvailableTime from '@modules/appointments/infra/typeorm/entities/AvailableTimeForAppointments';

let fakeUsersRepository: FakeUsersRepository;
let fakeAvailableTimeForAppointmentsRepository: FakeAvailableTimeForAppointmentsRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepoistory;

let createAvailableTimeForAppointmentsService: CreateAvailableTimeForAppointmentsService;
let bookAppointmentService: BookAppointmentService;

let serviceProvider: User;
let customer: User;

let now: Date;
let startTimestamp: Date;
let endTimestamp: Date;

let availableTimeForAppointments: AvailableTime;

describe('Create Available Time For Appointment', () => {
    beforeEach(async () => {
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

        serviceProvider = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        customer = await fakeUsersRepository.create({
            email: 'customer@example.com',
            forename: 'customer',
            surname: 'cash',
            password: '987654321',
        });

        now = new Date();

        startTimestamp = new Date(new Date().setHours(now.getHours() + 1));
        endTimestamp = new Date(new Date().setHours(now.getHours() + 2));

        availableTimeForAppointments = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp,
                end: endTimestamp,
                fromUserId: serviceProvider.id,
            },
        );
    });

    it('should be able to book an appointment', async () => {
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
        const serviceProvider2 = await fakeUsersRepository.create({
            email: 'johnsnow@example.com',
            forename: 'John',
            surname: 'Snow',
            password: '123456',
        });

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
