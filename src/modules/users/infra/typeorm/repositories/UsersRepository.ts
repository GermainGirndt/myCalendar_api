import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import IFindOneUserByEmailDTO from '@modules/users/dtos/IFindOneUserByEmailDTO';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import { getRepository, Repository } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';

export default class UserRepository implements IUsersRepository {
    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = getRepository(User);
    }

    public async create({
        forename,
        surname,
        email,
        password,
    }: ICreateUserDTO): Promise<User> {
        const user = this.ormRepository.create({
            forename,
            surname,
            email,
            password,
        });

        await this.ormRepository.save(user);

        return user;
    }

    public async findUserByEmail({
        email,
    }: IFindOneUserByEmailDTO): Promise<User | undefined> {
        const user = await this.ormRepository.findOne({
            where: { email },
        });

        return user;
    }
}
