import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateShift1764113271017 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "shift" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "startTime" TIMESTAMP NOT NULL,
                "endTime" TIMESTAMP NOT NULL,
                "isOpen" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_5496300765d7063256994784403" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "shift"`);
    }

}
