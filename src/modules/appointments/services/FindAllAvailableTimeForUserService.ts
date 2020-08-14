import { injectable, inject } from 'tsyringe';

import IAvailableTimeForAppointmentsRepository from '@modules/appointments/repositories/IAvailableTimeForAppointmentsRepository';
import IFindAllAvailableTimeFromUserIdDTO from '@modules/appointments/dtos/AvailableTime/IFindAllAvailableTimeFromUserIdDTO';

import AvailableTimeForAppointments from '@modules/appointments/infra/typeorm/entities/AvailableTimeForAppointments';

@injectable()
export default class FindAllAvailableTimeForUserService {
    constructor(
        @inject('AvailableTimeForAppointmentsRepository')
        private availableTimeForAppointmentsRepository: IAvailableTimeForAppointmentsRepository,
    ) {
        this.availableTimeForAppointmentsRepository = availableTimeForAppointmentsRepository;
    }

    public async execute({
        userId,
    }: IFindAllAvailableTimeFromUserIdDTO): Promise<
        AvailableTimeForAppointments[] | undefined
    > {
        const availableTimeForUser = await this.availableTimeForAppointmentsRepository.findAllFromUserId(
            { userId },
        );

        return availableTimeForUser;
    }
}
