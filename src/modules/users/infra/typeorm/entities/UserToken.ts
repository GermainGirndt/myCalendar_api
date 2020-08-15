import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    Generated,
    ManyToOne,
} from 'typeorm';
import User from './User';

@Entity('user_tokens')
export default class UserToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Generated('uuid')
    token: string;

    @Column()
    user_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    UserToken: User;

    @Column()
    created_at: Date;
}
