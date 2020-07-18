import { getRepository } from 'typeorm';
import AvailableTime from '../models/AvailableTime';
import AppError from '../error/AppError';
import { isValid } from 'date-fns';
import { isUuid } from 'uuidv4';

interface Request {
    start: Date;
    end: Date;
    fromUserId: string;
}

class CreateAvailableTimeService {
    public async execute({
        start,
        end,
        fromUserId,
    }: Request): Promise<AvailableTime> {
        if (!isValid(start) || !start) {
            throw new AppError('Please insert a valid appointment start date');
        } else if (!isValid(end) || !end) {
            throw new AppError('Please insert a valid appointment end date');
        } else if (!isUuid(fromUserId)) {
            throw new AppError('Please insert a valid user id');
        }

        const availableTimesRepository = getRepository(AvailableTime);

        const availableTime = await availableTimesRepository.create({
            start,
            end,
            from_user_id: fromUserId,
        });

        await availableTimesRepository.save(availableTime);

        return availableTime;
    }
}

export default CreateAvailableTimeService;
