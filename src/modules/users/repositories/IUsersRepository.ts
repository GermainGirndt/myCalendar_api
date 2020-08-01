import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindOneUserByEmailDTO from '@modules/users/dtos/IFindOneUserByEmailDTO';

import User from '@modules/users/infra/typeorm/entities/User';

export default interface IUserRepository {
    create({
        forename,
        surname,
        password,
        email,
    }: ICreateUserDTO): Promise<User>;

    findUserByEmail({
        email,
    }: IFindOneUserByEmailDTO): Promise<User | undefined>;
}
