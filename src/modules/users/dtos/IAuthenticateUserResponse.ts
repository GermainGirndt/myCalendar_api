import User from '@modules/users/infra/typeorm/entities/User';

export default interface IAuthenticateUserResponse {
    user: User;
    token: string;
}
