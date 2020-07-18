import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAvailableTime1595009873642 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'available_times',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'from_user_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'start',
                        type: 'timestamp with time zone',
                        default: 'now()',
                    },
                    {
                        name: 'end',
                        type: 'timestamp with time zone',
                        default: 'now()',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('available_time');
    }
}
