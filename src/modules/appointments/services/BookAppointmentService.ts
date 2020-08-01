import { injectable, inject } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import validateRequestDTOBookAppointment from '@modules/appointments/services/validators/validateRequestDTOBookAppointment';
import checkIfAppointmentCanBeBooked from '@modules/appointments/services/validators/checkIfAppointmentCanBeBooked';

import IBookAppointmentDTO from '@modules/appointments/dtos/IBookAppointmentDTO';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import IAvailableTimeForAppointmentsRepository from '../repositories/IAvailableTimeForAppointmentsRepository';

@injectable()
class BookAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('AppointmentsRepository')
        private availableTimeForAppointmentsRepository: IAvailableTimeForAppointmentsRepository,
    ) {
        this.appointmentsRepository = appointmentsRepository;
        this.availableTimeForAppointmentsRepository = availableTimeForAppointmentsRepository;
    }

    public async execute({
        fromAvailableTimeId,
        forUserId,
        start,
        end,
    }: IBookAppointmentDTO): Promise<Appointment> {
        validateRequestDTOBookAppointment({
            fromAvailableTimeId,
            forUserId,
            start,
            end,
        });

        await checkIfAppointmentCanBeBooked({
            availableTimeForAppointmentsRepository: this
                .availableTimeForAppointmentsRepository,
            appointmentsRepository: this.appointmentsRepository,
            forUserId,
            fromAvailableTimeId,
            start,
            end,
        });

        const newAppointment = this.appointmentsRepository.create({
            fromAvailableTimeId,
            forUserId,
            start,
            end,
        });

        return newAppointment;
    }
}

export default BookAppointmentService;
