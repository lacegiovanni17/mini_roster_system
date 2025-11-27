"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUser1764113190395 = void 0;
class CreateUser1764113190395 {
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
exports.CreateUser1764113190395 = CreateUser1764113190395;
//# sourceMappingURL=1764113190395-CreateUser.js.map