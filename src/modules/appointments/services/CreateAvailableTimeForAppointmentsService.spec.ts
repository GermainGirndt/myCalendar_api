import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import FakeAvailableTimeForAppointmentsRepository from './../repositories/fakes/FakeAvailableTimeForAppointmentsRepository';
import CreateAvailableTimeForAppointmentsService from './CreateAvailableTimeForAppointmentsService';

describe('Create Available Time For Appointment', () => {
    it('should be able to create an available time for appointment', async () => {
        const fakeAvailableTimeForAppointmentsRepository = new FakeAvailableTimeForAppointmentsRepository();
        const createAvailableTimeForAppointmentsService = new CreateAvailableTimeForAppointmentsService(
            fakeAvailableTimeForAppointmentsRepository,
        );

        const fakeUsersRepository = new FakeUsersRepository();
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
});
