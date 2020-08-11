import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import FakeAvailableTimeForAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAvailableTimeForAppointmentsRepository';
import FakeAppointmentsRepoistory from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import CreateAvailableTimeForAppointmentsService from '@modules/appointments/services/CreateAvailableTimeForAppointmentsService';
import BookAppointmentService from '@modules/appointments/services/BookAppointmentService';

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

        console.log(startTimestamp);
        console.log(endTimestamp);

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

        console.log(appointment);

        expect(appointment).toHaveProperty('id');
        expect(appointment.start).toBe(startTimestamp);
    });
});
