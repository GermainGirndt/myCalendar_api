import { getRepository, Between } from 'typeorm';
import AvailableTime from '../models/AvailableTime';
import validateRequestDTOCreateAvailableTime from '../validators/validateRequestDTOCreateAvailableTime';
import validateIfTimeAvailableInDB from '../validators/validateIfTimeAvailableInDB';

export interface Request {
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
        validateRequestDTOCreateAvailableTime({ start, end, fromUserId });

        const availableTimesRepository = getRepository(AvailableTime);

        await validateIfTimeAvailableInDB({
            repository: availableTimesRepository,
            start,
            end,
        });

        const availableTime = availableTimesRepository.create({
            start,
            end,
            from_user_id: fromUserId,
        });

        await availableTimesRepository.save(availableTime);

        return availableTime;
    }
}

export default CreateAvailableTimeService;
