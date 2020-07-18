import { getRepository, Between } from 'typeorm';
import AvailableTimeForAppointments from '../models/AvailableTimeForAppointments';
import validateRequestDTOCreateAvailableAppointment from '../validators/validateRequestDTOCreateAvailableAppointment';
import checkIfAppointmentIsAvailableInDB from '../validators/checkIfAppointmentIsAvailableInDB';

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

        await checkIfAppointmentIsAvailableInDB({
            repository: availableTimesForAppointmentsRepository,
            start,
            end,
            fromUserId,
        });

        const availableAppointment = availableTimesForAppointmentsRepository.create(
            {
                start,
                end,
                from_user_id: fromUserId,
            },
        );

        await availableTimesForAppointmentsRepository.save(
            availableAppointment,
        );

        return availableAppointment;
    }
}

export default CreateAvailableTimeForAppointmentsService;
