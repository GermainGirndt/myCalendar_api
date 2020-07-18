import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AlterCreateAppointmentsTableAddForeignKeys1595012577386
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            'appointments',
            new TableForeignKey({
                name: 'AppointmentFromAvailableTime',
                columnNames: ['from_available_time_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'available_times',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'appointments',
            new TableForeignKey({
                name: 'AppointmentForUser',
                columnNames: ['for_user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            'appointments',
            'AppointmentFromAvailableTime',
        );

        await queryRunner.dropForeignKey('appointments', 'AppointmentForUser');
    }
}
