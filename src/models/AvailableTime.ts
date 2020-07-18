import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import User from '../models/User';

@Entity('available_times')
class AvailableTime {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'from_user_id' })
    from_user_id: User;

    @Column('timestamp with time zone')
    start: Date;

    @Column('timestamp with time zone')
    end: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default AvailableTime;
