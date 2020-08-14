import { injectable, inject } from 'tsyringe';

import IAvailableTimeForAppointmentsRepository from '@modules/appointments/repositories/IAvailableTimeForAppointmentsRepository';
import ICreateAvailableTimeForAppointmentsDTO from '@modules/appointments/dtos/AvailableTime/ICreateAvailableTimeForAppointmentsDTO';

import AvailableTimeForAppointments from '@modules/appointments/infra/typeorm/entities/AvailableTimeForAppointments';

import checkIfTimeCanBeSetAsAvailable from '@modules/appointments/services/AvailableTime/CreateAvailableTimeForAppointmentsService/checkIfTimeCanBeSetAsAvailable';
import validateRequestDTOCreateAvailableAppointment from '@modules/appointments/services/AvailableTime/CreateAvailableTimeForAppointmentsService/validateRequestDTOCreateAvailableAppointment';

@injectable()
class CreateAvailableTimeForAppointmentsService {
    constructor(
        @inject('AvailableTimeForAppointmentsRepository')
        private availableTimeForAppointmentsRepository: IAvailableTimeForAppointmentsRepository,
    ) {}

    public async execute({
        start,
        end,
        fromUserId,
    }: ICreateAvailableTimeForAppointmentsDTO): Promise<
        AvailableTimeForAppointments
    > {
        validateRequestDTOCreateAvailableAppointment({
            start,
            end,
            fromUserId,
        });

        await checkIfTimeCanBeSetAsAvailable({
            availableTimesForAppointmentsRepository: this
                .availableTimeForAppointmentsRepository,
            start,
            end,
            fromUserId,
        });

        const availableTimeForAppointments = this.availableTimeForAppointmentsRepository.create(
            {
                start,
                end,
                fromUserId,
            },
        );

        return availableTimeForAppointments;
    }
}

export default CreateAvailableTimeForAppointmentsService;
