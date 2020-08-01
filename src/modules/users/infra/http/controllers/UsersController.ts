import { container } from 'tsyringe';

import { Request, Response } from 'express';

import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersControllers {
    async create(request: Request, response: Response): Promise<Response> {
        try {
            const { forename, surname, password, email } = request.body;

            const createUserService = container.resolve(CreateUserService);

            const user = await createUserService.execute({
                forename,
                surname,
                password,
                email,
            });

            delete user.password;

            return response.status(201).json(user);
        } catch (err) {
            console.log(err);
            return response.status(400).json({ error: err.message });
        }
    }
}
