"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateShift1764113271017 = void 0;
class CreateShift1764113271017 {
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "shift" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "startTime" TIMESTAMP NOT NULL,
                "endTime" TIMESTAMP NOT NULL,
                "isOpen" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_5496300765d7063256994784403" PRIMARY KEY ("id")
            )
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "shift"`);
    }
}
exports.CreateShift1764113271017 = CreateShift1764113271017;
//# sourceMappingURL=1764113271017-CreateShift.js.map