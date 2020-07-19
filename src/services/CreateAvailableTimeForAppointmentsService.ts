import { getRepository } from 'typeorm';
import AvailableTimeForAppointments from '../models/AvailableTimeForAppointments';
import validateRequestDTOCreateAvailableAppointment from '../validators/validateRequestDTOCreateAvailableAppointment';
import checkIfTimeCanBeSetAsAvailable from '../validators/checkIfTimeCanBeSetAsAvailable';

export interface Request {
    start: Date;
    end: Date;
    fromUserId: string;
}

class CreateAvailableTimeForAppointmentsService {
    public async execute({
        start,
        end,
        fromUserId,
    }: Request): Promise<AvailableTimeForAppointments> {
        validateRequestDTOCreateAvailableAppointment({
            start,
            end,
            fromUserId,
        });

        const availableTimesForAppointmentsRepository = getRepository(
            AvailableTimeForAppointments,
        );

        await checkIfTimeCanBeSetAsAvailable({
            availableTimesForAppointmentsRepository,
            start,
            end,
            fromUserId,
        });

        const availableTimeForAppointments = availableTimesForAppointmentsRepository.create(
            {
                start,
                end,
                from_user_id: fromUserId,
            },
        );

        await availableTimesForAppointmentsRepository.save(
            availableTimeForAppointments,
        );

        return availableTimeForAppointments;
    }
}

export default CreateAvailableTimeForAppointmentsService;
