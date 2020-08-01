import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '@modules/users/infra/typeorm/entities/User';

import { hash } from 'bcryptjs';

@injectable()
class CreateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {
        this.usersRepository = usersRepository;
    }
    public async execute({
        surname,
        forename,
        password,
        email,
    }: ICreateUserDTO): Promise<User> {
        const hashedPassword = await hash(password, 8);

        const user = this.usersRepository.create({
            surname,
            forename,
            password: hashedPassword,
            email,
        });

        return user;
    }
}

export default CreateUserService;
