import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTimeSlotToShift1764118128743 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "shift" 
            ADD COLUMN "timeSlot" VARCHAR NOT NULL DEFAULT 'morning'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "shift" 
            DROP COLUMN "timeSlot"
        `);
    }

}
