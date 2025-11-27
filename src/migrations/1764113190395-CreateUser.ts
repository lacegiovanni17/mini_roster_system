import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1764113190395 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "role" character varying NOT NULL DEFAULT 'user',
                "password" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
