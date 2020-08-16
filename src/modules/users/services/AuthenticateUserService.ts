import IAuthenticateUserRequest from '@modules/users/dtos/IAuthenticateUserRequest';
import IUserRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';

@injectable()
export default class AuthenticateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {
        this.usersRepository = usersRepository;
    }

    public async execute({ email, password }: IAuthenticateUserRequest) {
        const user = await this.usersRepository.findUserByEmail({ email });

        if (!user) {
            throw new AppError('Incorrect email/password combination');
        }

        const passwordsMatched = await this.hashProvider.compareHash(
            user.password,
            password,
        );

        if (!passwordsMatched) {
            throw new AppError('Incorrect email/password combination');
        }

        // if authentication succeded, do the following:

        // TOKEN

        // FIRST PARAMETER: payload with  token informations.
        // encripted, but NOT secure!

        // SECOND PARAMETER:
        // Secret key (any random string... you could use hashed algorithms)

        // THIRD PARAMETER:
        // token configurations
        // subject: user id -> the user that has the token
        // experesIn: token expiration

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, { subject: user.id, expiresIn });

        return { user, token };
    }
}
