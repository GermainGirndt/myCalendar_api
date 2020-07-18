import { Router } from 'express';
import CreateAvailableTimeService from '../../services/CreateAvailableTimeService';
import { parseISO, differenceInHours } from 'date-fns';

const availableTimeRouter = Router();

availableTimeRouter.post('/', async (request, response) => {
    try {
        const { start, end, fromUserId } = request.body;

        const createAvailableTimeService = new CreateAvailableTimeService();

        const availableTime = await createAvailableTimeService.execute({
            start: parseISO(start),
            end: parseISO(end),
            fromUserId,
        });

        return response.status(201).json(availableTime);
    } catch (err) {
        console.log(err);
        return response.status(400).json(err);
    }
});

export default availableTimeRouter;
