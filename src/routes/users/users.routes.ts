import { Router } from 'express';
import CreateUserService from '../../services/createUserService';
import AppError from '../../error/AppError';

const userRouter = Router();

userRouter.get('', (request, response) => {
    console.log('Incoming GET Request - Create Service Provider');
    return response.send('Incoming GET Request - List Client');
});

userRouter.post('', async (request, response) => {
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
