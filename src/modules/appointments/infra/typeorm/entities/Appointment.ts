import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
import AvailableTimeForAppointments from '@modules/appointments/infra/typeorm/entities/AvailableTimeForAppointments';

@Entity('appointments')
class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    from_available_time_id: string;

    @ManyToOne(() => AvailableTimeForAppointments)
    @JoinColumn({ name: 'from_available_time_id' })
    AppointmentFromAvailableTime: AvailableTimeForAppointments;

    @Column()
    for_user_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'for_user_id' })
    AppointmentForUser: User;

    @Column('timestamp with time zone')
    start: Date;

    @Column('timestamp with time zone')
    end: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Appointment;
