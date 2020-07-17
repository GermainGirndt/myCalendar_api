import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';
import AppError from '../error/AppError';

interface Request {
    surname: string;
    forename: string;
    password: string;
    email: string;
}

class CreateUserService {
    public async execute({
        surname,
        forename,
        password,
        email,
    }: Request): Promise<User> {
        const usersRepository = getRepository(User);

        const checkUserExists = usersRepository.findOne({
            where: { email },
        });

        // Internal error: generates no http response
        if (checkUserExists) {
            throw new AppError('Email address already exists');
        }

        const hashedPassword = await hash(password, 8);

        const user = usersRepository.create({
            surname,
            forename,
            password: hashedPassword,
            email,
        });

        await usersRepository.save(user);

        return user;
    }
}

export default CreateUserService;
