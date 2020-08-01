import { injectable, inject } from 'tsyringe';
import IAvailableTimeForAppointmentsRepository from '@modules/appointments/repositories/IAvailableTimeForAppointmentsRepository';
import AvailableTimeForAppointments from '@modules/appointments/infra/typeorm/entities/AvailableTimeForAppointments';
import IFindAllAvailableTimeForUserDTO from '@modules/appointments/dtos/IFindAllAvailableTimeForUserDTO';

@injectable()
export default class FindAvailableTimeForUserService {
    constructor(
        @inject('AvailableTimeForAppointmentsRepository')
        private availableTimeForAppointmentsRepository: IAvailableTimeForAppointmentsRepository,
    ) {
        this.availableTimeForAppointmentsRepository = availableTimeForAppointmentsRepository;
    }

    public async execute({
        userId,
    }: IFindAllAvailableTimeForUserDTO): Promise<
        AvailableTimeForAppointments[] | undefined
    > {
        const availableTimeForUser = this.availableTimeForAppointmentsRepository.findAll(
            { userId },
        );

        return availableTimeForUser;
    }
}
