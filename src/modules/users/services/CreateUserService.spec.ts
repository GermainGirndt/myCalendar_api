import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';

import CreateUserService from './CreateUserService';

describe('Create a new User', () => {
    it('should be able to create a new User', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        const forename = 'John';
        const surname = 'Doe';
        const password = '12345678';
        const email = 'johndoe@example.com';

        const user = (await createUserService.execute({
            forename,
            surname,
            password,
            email,
        })) as User;

        expect(user.forename).toBe(forename);
        expect(user.surname).toBe(surname);
        expect(user.password).toBe(password);
        expect(user.email).toBe(email);
    });

    it('should not be able to create a new user for same e-mail address', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        const forename = 'John';
        const surname = 'Doe';
        const password = '12345678';
        const email = 'johndoe@example.com';

        const user = (await createUserService.execute({
            forename,
            surname,
            password,
            email,
        })) as User;

        expect(user.forename).toBe(forename);
        expect(user.surname).toBe(surname);
        expect(user.password).toBe(password);
        expect(user.email).toBe(email);

        await expect(
            createUserService.execute({
                forename: 'David',
                surname: 'Gilmore',
                password: '987654321',
                email,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
