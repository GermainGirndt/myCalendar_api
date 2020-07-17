import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
} from 'typeorm';

@Entity('service_providers')
class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    forename: string;

    @Column()
    surname: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default User;
