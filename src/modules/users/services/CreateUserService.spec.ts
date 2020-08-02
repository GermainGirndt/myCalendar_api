import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';

describe('Create a new User', () => {
    it('should create a new User', async () => {
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

        const user = await createUserService.execute({
            forename,
            surname,
            password,
            email,
        });

        expect(user.forename).toBe(forename);
        expect(user.surname).toBe(surname);
        expect(user.password).toBe(password);
        expect(user.email).toBe(email);
    });
});
