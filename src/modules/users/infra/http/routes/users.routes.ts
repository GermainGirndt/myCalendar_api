import { Router } from 'express';
import CreateUserService from '@modules/users/services/CreateUserService';
import { container } from 'tsyringe';

const userRouter = Router();

userRouter.post('', async (request, response) => {
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
});

export default userRouter;
