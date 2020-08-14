import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import FakeAvailableTimeForAppointmentsRepository from './../repositories/fakes/FakeAvailableTimeForAppointmentsRepository';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import BookAppointmentService from '@modules/appointments/services/BookAppointmentService';
import CreateAvailableTimeForAppointmentsService from './CreateAvailableTimeForAppointmentsService';
import FindAllAppointmentsForUserService from './FindAllAppointmentsForUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeAvailableTimeForAppointmentsRepository: FakeAvailableTimeForAppointmentsRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

let createAvailableTimeForAppointmentsService: CreateAvailableTimeForAppointmentsService;
let findAllAppointmentsForUserService: FindAllAppointmentsForUserService;
let bookAppointmentService: BookAppointmentService;

let startTimestamp: Date;
let endTimestamp: Date;

describe('FindAllAppointmentsForuserService', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeAvailableTimeForAppointmentsRepository = new FakeAvailableTimeForAppointmentsRepository();

        fakeAppointmentsRepository = new FakeAppointmentsRepository();

        createAvailableTimeForAppointmentsService = new CreateAvailableTimeForAppointmentsService(
            fakeAvailableTimeForAppointmentsRepository,
        );

        bookAppointmentService = new BookAppointmentService(
            fakeAppointmentsRepository,
            fakeAvailableTimeForAppointmentsRepository,
        );
    });

    it('should be able to find an appointment from the same customer', async () => {
        const serviceProvider = await fakeUsersRepository.create({
            email: 'alexturner@example.com',
            forename: 'Alex',
            surname: 'Turner',
            password: '123456',
        });

        const customer = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const now = new Date();
        startTimestamp = new Date(new Date().setMinutes(now.getMinutes() + 1));
        endTimestamp = new Date(
            new Date().setHours(startTimestamp.getHours() + 1),
        );

        const availableTime = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp,
                end: endTimestamp,
                fromUserId: serviceProvider.id,
            },
        );
        const appointment = await bookAppointmentService.execute({
            start: startTimestamp,
            end: endTimestamp,
            fromAvailableTimeId: availableTime.id,
            forUserId: customer.id,
        });

        fakeAppointmentsRepository.registerAvailableTime(availableTime);

        findAllAppointmentsForUserService = new FindAllAppointmentsForUserService(
            fakeAppointmentsRepository,
        );

        const allAppointments = await findAllAppointmentsForUserService.execute(
            {
                userId: customer.id,
            },
        );

        expect(allAppointments.appointmentsAsClient).toHaveLength(1);
        expect(allAppointments.appointmentsAsClient).toContain(appointment);
        expect(allAppointments.appointmentsAsServiceProvider).toHaveLength(0);
    });

    it('should be able to find multipe appointments from the same customer', async () => {
        const serviceProvider = await fakeUsersRepository.create({
            email: 'alexturner@example.com',
            forename: 'Alex',
            surname: 'Turner',
            password: '123456',
        });

        const customer = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const now = new Date();
        startTimestamp = new Date(new Date().setMinutes(now.getMinutes() + 1));
        endTimestamp = new Date(
            new Date().setHours(startTimestamp.getHours() + 1),
        );

        const startTimestamp2 = new Date(
            new Date().setHours(
                endTimestamp.getHours(),
                endTimestamp.getMinutes() + 1,
            ),
        );
        const endTimestamp2 = new Date(
            new Date().setHours(
                startTimestamp2.getHours(),
                startTimestamp2.getMinutes(),
            ),
        );

        const startTimestamp3 = new Date(
            new Date().setHours(
                endTimestamp2.getHours(),
                endTimestamp2.getMinutes() + 1,
            ),
        );
        const endTimestamp3 = new Date(
            new Date().setHours(
                startTimestamp3.getHours(),
                startTimestamp3.getMinutes(),
            ),
        );

        const availableTime = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp,
                end: endTimestamp,
                fromUserId: serviceProvider.id,
            },
        );

        const availableTime2 = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp2,
                end: endTimestamp2,
                fromUserId: serviceProvider.id,
            },
        );

        const availableTime3 = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp3,
                end: endTimestamp3,
                fromUserId: serviceProvider.id,
            },
        );

        const appointment = await bookAppointmentService.execute({
            start: startTimestamp,
            end: endTimestamp,
            fromAvailableTimeId: availableTime.id,
            forUserId: customer.id,
        });

        const appointment2 = await bookAppointmentService.execute({
            start: startTimestamp2,
            end: endTimestamp2,
            fromAvailableTimeId: availableTime2.id,
            forUserId: customer.id,
        });

        const appointment3 = await bookAppointmentService.execute({
            start: startTimestamp3,
            end: endTimestamp3,
            fromAvailableTimeId: availableTime3.id,
            forUserId: customer.id,
        });

        fakeAppointmentsRepository.registerAvailableTime(availableTime);

        findAllAppointmentsForUserService = new FindAllAppointmentsForUserService(
            fakeAppointmentsRepository,
        );

        const allAppointments = await findAllAppointmentsForUserService.execute(
            {
                userId: customer.id,
            },
        );

        expect(allAppointments.appointmentsAsClient).toHaveLength(3);
        expect(allAppointments.appointmentsAsClient).toEqual([
            appointment,
            appointment2,
            appointment3,
        ]);
        expect(allAppointments.appointmentsAsServiceProvider).toHaveLength(0);
    });

    it('should be able to find multipe appointments different customers', async () => {
        const serviceProvider = await fakeUsersRepository.create({
            email: 'alexturner@example.com',
            forename: 'Alex',
            surname: 'Turner',
            password: '123456',
        });

        const customer = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const customer2 = await fakeUsersRepository.create({
            email: 'johntre@example.com',
            forename: 'John',
            surname: 'Tre',
            password: '123456',
        });

        const now = new Date();
        startTimestamp = new Date(new Date().setMinutes(now.getMinutes() + 1));
        endTimestamp = new Date(
            new Date().setHours(startTimestamp.getHours() + 1),
        );

        const startTimestamp2 = new Date(
            new Date().setHours(
                endTimestamp.getHours(),
                endTimestamp.getMinutes() + 1,
            ),
        );
        const endTimestamp2 = new Date(
            new Date().setHours(
                startTimestamp2.getHours(),
                startTimestamp2.getMinutes(),
            ),
        );

        const startTimestamp3 = new Date(
            new Date().setHours(
                endTimestamp2.getHours(),
                endTimestamp2.getMinutes() + 1,
            ),
        );
        const endTimestamp3 = new Date(
            new Date().setHours(
                startTimestamp3.getHours(),
                startTimestamp3.getMinutes(),
            ),
        );

        const availableTime = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp,
                end: endTimestamp,
                fromUserId: serviceProvider.id,
            },
        );

        const availableTime2 = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp2,
                end: endTimestamp2,
                fromUserId: serviceProvider.id,
            },
        );

        const availableTime3 = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp3,
                end: endTimestamp3,
                fromUserId: serviceProvider.id,
            },
        );

        const appointment = await bookAppointmentService.execute({
            start: startTimestamp,
            end: endTimestamp,
            fromAvailableTimeId: availableTime.id,
            forUserId: customer.id,
        });

        const appointment2 = await bookAppointmentService.execute({
            start: startTimestamp2,
            end: endTimestamp2,
            fromAvailableTimeId: availableTime2.id,
            forUserId: customer2.id,
        });

        const appointment3 = await bookAppointmentService.execute({
            start: startTimestamp3,
            end: endTimestamp3,
            fromAvailableTimeId: availableTime3.id,
            forUserId: customer.id,
        });

        fakeAppointmentsRepository.registerAvailableTime(availableTime);

        findAllAppointmentsForUserService = new FindAllAppointmentsForUserService(
            fakeAppointmentsRepository,
        );

        const allAppointments = await findAllAppointmentsForUserService.execute(
            {
                userId: customer.id,
            },
        );

        const allAppointments2 = await findAllAppointmentsForUserService.execute(
            {
                userId: customer2.id,
            },
        );

        // checks for customer 1

        expect(allAppointments.appointmentsAsClient).toHaveLength(2);
        expect(allAppointments.appointmentsAsClient).toContain(appointment);
        expect(allAppointments.appointmentsAsClient).toContain(appointment3);
        expect(allAppointments.appointmentsAsServiceProvider).toHaveLength(0);

        // checks for customer 2
        expect(allAppointments2.appointmentsAsClient).toHaveLength(1);
        expect(allAppointments2.appointmentsAsClient).toContain(appointment2);
        expect(allAppointments2.appointmentsAsServiceProvider).toHaveLength(0);
    });

    it('should be able to find an appointment for the same service provider', async () => {
        const serviceProvider = await fakeUsersRepository.create({
            email: 'alexturner@example.com',
            forename: 'Alex',
            surname: 'Turner',
            password: '123456',
        });

        const customer = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const now = new Date();
        startTimestamp = new Date(new Date().setMinutes(now.getMinutes() + 1));
        endTimestamp = new Date(
            new Date().setHours(startTimestamp.getHours() + 1),
        );

        const availableTime = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp,
                end: endTimestamp,
                fromUserId: serviceProvider.id,
            },
        );
        const appointment = await bookAppointmentService.execute({
            start: startTimestamp,
            end: endTimestamp,
            fromAvailableTimeId: availableTime.id,
            forUserId: customer.id,
        });

        fakeAppointmentsRepository.registerAvailableTime(availableTime);

        findAllAppointmentsForUserService = new FindAllAppointmentsForUserService(
            fakeAppointmentsRepository,
        );

        const allAppointments = await findAllAppointmentsForUserService.execute(
            {
                userId: serviceProvider.id,
            },
        );

        expect(allAppointments.appointmentsAsClient).toHaveLength(0);
        expect(allAppointments.appointmentsAsServiceProvider).toHaveLength(1);
        expect(allAppointments.appointmentsAsServiceProvider).toContain(
            appointment,
        );
    });

    it('should be able to find multiple appointments for the same service provider', async () => {
        const serviceProvider = await fakeUsersRepository.create({
            email: 'alexturner@example.com',
            forename: 'Alex',
            surname: 'Turner',
            password: '123456',
        });

        const customer = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const now = new Date();
        startTimestamp = new Date(new Date().setMinutes(now.getMinutes() + 1));
        endTimestamp = new Date(
            new Date().setHours(startTimestamp.getHours() + 1),
        );

        const startTimestamp2 = new Date(
            new Date().setHours(
                endTimestamp.getHours(),
                endTimestamp.getMinutes() + 1,
            ),
        );
        const endTimestamp2 = new Date(
            new Date().setHours(
                startTimestamp2.getHours(),
                startTimestamp2.getMinutes(),
            ),
        );

        const startTimestamp3 = new Date(
            new Date().setHours(
                endTimestamp2.getHours(),
                endTimestamp2.getMinutes() + 1,
            ),
        );
        const endTimestamp3 = new Date(
            new Date().setHours(
                startTimestamp3.getHours(),
                startTimestamp3.getMinutes(),
            ),
        );

        const availableTime = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp,
                end: endTimestamp,
                fromUserId: serviceProvider.id,
            },
        );

        const availableTime2 = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp2,
                end: endTimestamp2,
                fromUserId: serviceProvider.id,
            },
        );

        const availableTime3 = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp3,
                end: endTimestamp3,
                fromUserId: serviceProvider.id,
            },
        );

        const appointment = await bookAppointmentService.execute({
            start: startTimestamp,
            end: endTimestamp,
            fromAvailableTimeId: availableTime.id,
            forUserId: customer.id,
        });

        const appointment2 = await bookAppointmentService.execute({
            start: startTimestamp2,
            end: endTimestamp2,
            fromAvailableTimeId: availableTime2.id,
            forUserId: customer.id,
        });

        const appointment3 = await bookAppointmentService.execute({
            start: startTimestamp3,
            end: endTimestamp3,
            fromAvailableTimeId: availableTime3.id,
            forUserId: customer.id,
        });

        fakeAppointmentsRepository.registerAvailableTime(availableTime);
        fakeAppointmentsRepository.registerAvailableTime(availableTime2);
        fakeAppointmentsRepository.registerAvailableTime(availableTime3);

        findAllAppointmentsForUserService = new FindAllAppointmentsForUserService(
            fakeAppointmentsRepository,
        );

        const allAppointments = await findAllAppointmentsForUserService.execute(
            {
                userId: serviceProvider.id,
            },
        );

        expect(allAppointments.appointmentsAsClient).toHaveLength(0);
        expect(allAppointments.appointmentsAsServiceProvider).toHaveLength(3);
        expect(allAppointments.appointmentsAsServiceProvider).toContain(
            appointment,
        );
        expect(allAppointments.appointmentsAsServiceProvider).toContain(
            appointment2,
        );
        expect(allAppointments.appointmentsAsServiceProvider).toContain(
            appointment3,
        );
    });

    it('should be able to find multiple appointments for differents service providers', async () => {
        const serviceProvider = await fakeUsersRepository.create({
            email: 'alexturner@example.com',
            forename: 'Alex',
            surname: 'Turner',
            password: '123456',
        });

        const serviceProvider2 = await fakeUsersRepository.create({
            email: 'beatles@example.com',
            forename: 'b',
            surname: 'tles',
            password: '123456',
        });

        const customer = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const now = new Date();
        startTimestamp = new Date(new Date().setMinutes(now.getMinutes() + 1));
        endTimestamp = new Date(
            new Date().setHours(startTimestamp.getHours() + 1),
        );

        const startTimestamp2 = new Date(
            new Date().setHours(
                endTimestamp.getHours(),
                endTimestamp.getMinutes() + 1,
            ),
        );
        const endTimestamp2 = new Date(
            new Date().setHours(
                startTimestamp2.getHours(),
                startTimestamp2.getMinutes(),
            ),
        );

        const startTimestamp3 = new Date(
            new Date().setHours(
                endTimestamp2.getHours(),
                endTimestamp2.getMinutes() + 1,
            ),
        );
        const endTimestamp3 = new Date(
            new Date().setHours(
                startTimestamp3.getHours(),
                startTimestamp3.getMinutes(),
            ),
        );

        const availableTime = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp,
                end: endTimestamp,
                fromUserId: serviceProvider.id,
            },
        );

        const availableTime2 = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp2,
                end: endTimestamp2,
                fromUserId: serviceProvider2.id,
            },
        );

        const availableTime3 = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp3,
                end: endTimestamp3,
                fromUserId: serviceProvider.id,
            },
        );

        const appointment = await bookAppointmentService.execute({
            start: startTimestamp,
            end: endTimestamp,
            fromAvailableTimeId: availableTime.id,
            forUserId: customer.id,
        });

        const appointment2 = await bookAppointmentService.execute({
            start: startTimestamp2,
            end: endTimestamp2,
            fromAvailableTimeId: availableTime2.id,
            forUserId: customer.id,
        });

        const appointment3 = await bookAppointmentService.execute({
            start: startTimestamp3,
            end: endTimestamp3,
            fromAvailableTimeId: availableTime3.id,
            forUserId: customer.id,
        });

        fakeAppointmentsRepository.registerAvailableTime(availableTime);
        fakeAppointmentsRepository.registerAvailableTime(availableTime2);
        fakeAppointmentsRepository.registerAvailableTime(availableTime3);

        findAllAppointmentsForUserService = new FindAllAppointmentsForUserService(
            fakeAppointmentsRepository,
        );

        const allAppointments = await findAllAppointmentsForUserService.execute(
            {
                userId: serviceProvider.id,
            },
        );

        expect(allAppointments.appointmentsAsClient).toHaveLength(0);
        expect(allAppointments.appointmentsAsServiceProvider).toHaveLength(2);
        expect(allAppointments.appointmentsAsServiceProvider).toContain(
            appointment,
        );
        expect(allAppointments.appointmentsAsServiceProvider).toContain(
            appointment3,
        );

        const allAppointments2 = await findAllAppointmentsForUserService.execute(
            {
                userId: serviceProvider2.id,
            },
        );

        expect(allAppointments2.appointmentsAsClient).toHaveLength(0);
        expect(allAppointments2.appointmentsAsServiceProvider).toHaveLength(1);
        expect(allAppointments2.appointmentsAsServiceProvider).toContain(
            appointment2,
        );
    });

    it('should be able to find multiple appointments for differents service providers and customers', async () => {
        const serviceProvider = await fakeUsersRepository.create({
            email: 'alexturner@example.com',
            forename: 'Alex',
            surname: 'Turner',
            password: '123456',
        });

        const serviceProviderAndCustomer = await fakeUsersRepository.create({
            email: 'beatles@example.com',
            forename: 'b',
            surname: 'tles',
            password: '123456',
        });

        const customer = await fakeUsersRepository.create({
            email: 'johndoe@example.com',
            forename: 'John',
            surname: 'Doe',
            password: '123456',
        });

        const now = new Date();
        startTimestamp = new Date(new Date().setMinutes(now.getMinutes() + 1));
        endTimestamp = new Date(
            new Date().setHours(startTimestamp.getHours() + 1),
        );

        const startTimestamp2 = new Date(
            new Date().setHours(
                endTimestamp.getHours(),
                endTimestamp.getMinutes() + 1,
            ),
        );
        const endTimestamp2 = new Date(
            new Date().setHours(
                startTimestamp2.getHours(),
                startTimestamp2.getMinutes(),
            ),
        );

        const startTimestamp3 = new Date(
            new Date().setHours(
                endTimestamp2.getHours(),
                endTimestamp2.getMinutes() + 1,
            ),
        );
        const endTimestamp3 = new Date(
            new Date().setHours(
                startTimestamp3.getHours(),
                startTimestamp3.getMinutes(),
            ),
        );

        const availableTime = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp,
                end: endTimestamp,
                fromUserId: serviceProvider.id,
            },
        );

        const availableTime2 = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp2,
                end: endTimestamp2,
                fromUserId: serviceProviderAndCustomer.id,
            },
        );

        const availableTime3 = await createAvailableTimeForAppointmentsService.execute(
            {
                start: startTimestamp3,
                end: endTimestamp3,
                fromUserId: serviceProvider.id,
            },
        );

        const appointment = await bookAppointmentService.execute({
            start: startTimestamp,
            end: endTimestamp,
            fromAvailableTimeId: availableTime.id,
            forUserId: serviceProviderAndCustomer.id,
        });

        const appointment2 = await bookAppointmentService.execute({
            start: startTimestamp2,
            end: endTimestamp2,
            fromAvailableTimeId: availableTime2.id,
            forUserId: customer.id,
        });

        const appointment3 = await bookAppointmentService.execute({
            start: startTimestamp3,
            end: endTimestamp3,
            fromAvailableTimeId: availableTime3.id,
            forUserId: customer.id,
        });

        fakeAppointmentsRepository.registerAvailableTime(availableTime);
        fakeAppointmentsRepository.registerAvailableTime(availableTime2);
        fakeAppointmentsRepository.registerAvailableTime(availableTime3);

        findAllAppointmentsForUserService = new FindAllAppointmentsForUserService(
            fakeAppointmentsRepository,
        );

        const allAppointments = await findAllAppointmentsForUserService.execute(
            {
                userId: serviceProvider.id,
            },
        );

        expect(allAppointments.appointmentsAsClient).toHaveLength(0);
        expect(allAppointments.appointmentsAsServiceProvider).toHaveLength(2);
        expect(allAppointments.appointmentsAsServiceProvider).toContain(
            appointment,
        );
        expect(allAppointments.appointmentsAsServiceProvider).not.toContain(
            appointment2,
        );
        expect(allAppointments.appointmentsAsServiceProvider).toContain(
            appointment3,
        );

        const allAppointments2 = await findAllAppointmentsForUserService.execute(
            {
                userId: serviceProviderAndCustomer.id,
            },
        );

        expect(allAppointments2.appointmentsAsClient).toHaveLength(1);
        expect(allAppointments2.appointmentsAsClient).toContain(appointment);
        expect(allAppointments2.appointmentsAsServiceProvider).toHaveLength(1);
        expect(allAppointments2.appointmentsAsServiceProvider).toContain(
            appointment2,
        );

        const allAppointments3 = await findAllAppointmentsForUserService.execute(
            {
                userId: customer.id,
            },
        );
        expect(allAppointments3.appointmentsAsClient).toHaveLength(2);
        expect(allAppointments3.appointmentsAsClient).toContain(appointment2);
        expect(allAppointments3.appointmentsAsClient).toContain(appointment3);
        expect(allAppointments3.appointmentsAsServiceProvider).toHaveLength(0);
    });
});
