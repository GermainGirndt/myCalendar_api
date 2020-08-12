import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IFindAllAppointmentsForUserIdDTO from '@modules/appointments/dtos/IFindAllAppointmentsForUserIdDTO';

import IAllAppointmentsForUserId from '@modules/appointments/dtos/IAllAppointmentsForUserId';

@injectable()
export default class FindAllAppointmentsForUserService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {
        this.appointmentsRepository = appointmentsRepository;
    }

    public async execute({
        userId,
    }: IFindAllAppointmentsForUserIdDTO): Promise<IAllAppointmentsForUserId> {
        const appointments = await this.appointmentsRepository.findAllForUserId(
            {
                userId,
            },
        );

        return appointments;
    }
}
