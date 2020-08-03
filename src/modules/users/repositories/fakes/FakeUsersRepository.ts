import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import IFindOneUserByEmailDTO from '@modules/users/dtos/IFindOneUserByEmailDTO';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '@modules/users/infra/typeorm/entities/User';

import { uuid } from 'uuidv4';

export default class UserRepository implements IUsersRepository {
    private fakeUserRepository: User[] = [];

    public async create({
        forename,
        surname,
        email,
        password,
    }: ICreateUserDTO): Promise<User> {
        const user = new User();

        Object.assign(user, { id: uuid(), forename, surname, email, password });

        this.fakeUserRepository.push(user);

        return user;
    }

    public async findUserByEmail({
        email,
    }: IFindOneUserByEmailDTO): Promise<User | undefined> {
        const user = this.fakeUserRepository.find(user => user.email === email);

        return user;
    }
}
