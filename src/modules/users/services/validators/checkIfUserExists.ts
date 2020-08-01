import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IFindOneUserByEmailDTO from '@modules/users/dtos/IFindOneUserByEmailDTO';

interface ValidationRequestDTO extends IFindOneUserByEmailDTO {
    usersRepository: IUsersRepository;
}

export default async function checkIfUserAlreadyExists({
    usersRepository,
    email,
}: ValidationRequestDTO): Promise<void> {
    const checkUserExists = usersRepository.findUserByEmail({ email });

    // Internal error: generates no http response
    if (checkUserExists) {
        console.log(checkUserExists);
        throw new AppError('Email address already exists');
    }
}
