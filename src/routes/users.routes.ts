import { Router } from 'express';
import CreateUserService from '../services/CreateUserService';

const userRouter = Router();

userRouter.post('', async (request, response) => {
    try {
        const { forename, surname, password, email } = request.body;

        const createUserService = new CreateUserService();

        const user = await createUserService.execute({
            forename,
            surname,
            password,
            email,
        });

        delete user.password;

        return response.status(201).json(user);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

export default userRouter;
