import { Router } from 'express';
import CreateServiceProviderService from '../../services/createServiceProviderService';
import AppError from '../../error/AppError';

const serviceProviderRouter = Router();

serviceProviderRouter.get('', (request, response) => {
    console.log('Incoming GET Request - Create Service Provider');
    return response.send('Incoming GET Request - List Client');
});

serviceProviderRouter.post('', async (request, response) => {
    try {
        console.log('Incoming Post Request - Create Service Provider');
        const { forename, surname, password, email } = request.body;
        console.log(forename, surname, password, email);

        const createServiceProviderService = new CreateServiceProviderService();

        const serviceProvider = await createServiceProviderService.execute({
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

export default serviceProviderRouter;
