import { Router } from 'express';
import CreateUserService from '../../services/CreateUserService';

const userRouter = Router();

userRouter.post('', async (request, response) => {
    console.log(request);
    try {
        console.log('Incoming Post Request - Create Service Provider');
        const { forename, surname, password, email } = request.body;
        console.log(forename, surname, password, email);

        const createUserService = new CreateUserService();

        const serviceProvider = await createUserService.execute({
            forename,
            surname,
            password,
            email,
        });

        return response.status(201).json(serviceProvider);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

export default userRouter;
