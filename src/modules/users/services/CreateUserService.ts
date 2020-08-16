import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

import User from '@modules/users/infra/typeorm/entities/User';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import checkIfUserExists from '@modules/users/services/validators/checkIfUserExists';

import AppError from '@shared/errors/AppError';

@injectable()
class CreateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {
        this.usersRepository = usersRepository;
        this.hashProvider = hashProvider;
    }
    public async execute({
        forename,
        surname,
        password,
        email,
    }: ICreateUserDTO): Promise<User> {
        await checkIfUserExists({
            usersRepository: this.usersRepository,
            email,
        });

        // create email and password validation

        const hashedPassword = await this.hashProvider.generateHash(password);

        const user = await this.usersRepository.create({
            surname,
            forename,
            password: hashedPassword,
            email,
        });

        return user;
    }
}

export default CreateUserService;
