"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTimeSlotToShift1764118128743 = void 0;
class AddTimeSlotToShift1764118128743 {
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "shift" 
            ADD COLUMN "timeSlot" VARCHAR NOT NULL DEFAULT 'morning'
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "shift" 
            DROP COLUMN "timeSlot"
        `);
    }
}
exports.AddTimeSlotToShift1764118128743 = AddTimeSlotToShift1764118128743;
//# sourceMappingURL=1764118128743-AddTimeSlotToShift.js.map