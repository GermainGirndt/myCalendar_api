import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import ServiceProvider from '../models/ServiceProvider';
import AppError from '../error/AppError';

interface Request {
    surname: string;
    forename: string;
    password: string;
    email: string;
}

class CreateServiceProviderService {
    public async execute({
        surname,
        forename,
        password,
        email,
    }: Request): Promise<ServiceProvider> {
        const serviceProvidersRepository = getRepository(ServiceProvider);

        const checkUserExists = serviceProvidersRepository.findOne({
            where: { email },
        });

        // Internal error: generates no http response
        if (checkUserExists) {
            throw new AppError('Email address already exists');
        }

        const hashedPassword = await hash(password, 8);

        const serviceProvider = serviceProvidersRepository.create({
            surname,
            forename,
            password: hashedPassword,
            email,
        });

        await serviceProvidersRepository.save(serviceProvider);

        return serviceProvider;
    }
}

export default CreateServiceProviderService;
