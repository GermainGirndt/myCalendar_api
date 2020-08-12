import { injectable, inject } from 'tsyringe';

import IBookAppointmentDTO from '@modules/appointments/dtos/IBookAppointmentDTO';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IAvailableTimeForAppointmentsRepository from '@modules/appointments/repositories/IAvailableTimeForAppointmentsRepository';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

import checkIfAppointmentCanBeBooked from './checkIfAppointmentCanBeBooked';
import validateRequestDTOBookAppointment from './validateRequestDTOBookAppointment';

@injectable()
class BookAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('AvailableTimeForAppointmentsRepository')
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

        console.log('can be booked');

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
