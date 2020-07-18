import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import AvailableTimeForAppointments from './AvailableTimeForAppointments';
import User from './User';

@Entity('appointments')
class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    from_available_time_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'from_available_time_id' })
    AppointmentFromAvailableTime: AvailableTimeForAppointments;

    @Column()
    AppointmentForUser: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'for_user_id' })
    forUserID: User;

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
