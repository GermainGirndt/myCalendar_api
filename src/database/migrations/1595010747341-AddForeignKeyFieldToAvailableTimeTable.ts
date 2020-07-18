import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddForeignKeyFieldToAvailableTimeTable1595010747341
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            'available_time_for_appointments',
            new TableForeignKey({
                name: 'AvailableTimeFromUser',
                columnNames: ['from_user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            'available_time_for_appointments',
            'AvailableTimeFromUser',
        );
    }
}
