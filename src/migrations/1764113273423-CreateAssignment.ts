import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAssignment1764113273423 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "assignment" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid NOT NULL,
                "shiftId" uuid NOT NULL,
                CONSTRAINT "PK_444444444444444444444444444" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "assignment" 
            ADD CONSTRAINT "FK_assignment_user" 
            FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "assignment" 
            ADD CONSTRAINT "FK_assignment_shift" 
            FOREIGN KEY ("shiftId") REFERENCES "shift"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignment" DROP CONSTRAINT "FK_assignment_shift"`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP CONSTRAINT "FK_assignment_user"`);
        await queryRunner.query(`DROP TABLE "assignment"`);
    }

}
