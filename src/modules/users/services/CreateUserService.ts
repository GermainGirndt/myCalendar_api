import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

import User from '@modules/users/infra/typeorm/entities/User';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import checkIfUserExists from '@modules/users/services/validators/checkIfUserExists';

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
        //checkIfUserExists({ usersRepository: this.usersRepository, email });

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
