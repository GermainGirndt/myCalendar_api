import { container } from 'tsyringe';

import { Request, Response } from 'express';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
    async create(request: Request, response: Response): Promise<Response> {
        try {
            const { email, password } = request.body;

            const authenticateUserService = container.resolve(
                AuthenticateUserService,
            );

            const { user, token } = await authenticateUserService.execute({
                email,
                password,
            });

            delete user.password;

            return response.status(201).json({ user, token });
        } catch (err) {
            console.log(err);
            return response.status(400).json({ error: err.message });
        }
    }
}
