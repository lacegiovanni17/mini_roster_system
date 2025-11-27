import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateShiftCancellation1764118845978 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "shift_cancellation" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid NOT NULL,
                "shiftId" uuid NOT NULL,
                "reason" character varying NOT NULL,
                "cancelledAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_shift_cancellation" PRIMARY KEY ("id"),
                CONSTRAINT "FK_cancellation_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_cancellation_shift" FOREIGN KEY ("shiftId") REFERENCES "shift"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "shift_cancellation"`);
    }

}
