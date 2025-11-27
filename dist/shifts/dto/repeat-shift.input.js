"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepeatShiftInput = void 0;
const graphql_1 = require("@nestjs/graphql");
const time_slot_enum_1 = require("../enums/time-slot.enum");
let RepeatShiftInput = class RepeatShiftInput {
    userId;
    startDate;
    endDate;
    timeSlot;
    daysOfWeek;
    isOpen;
};
exports.RepeatShiftInput = RepeatShiftInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], RepeatShiftInput.prototype, "userId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RepeatShiftInput.prototype, "startDate", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RepeatShiftInput.prototype, "endDate", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], RepeatShiftInput.prototype, "timeSlot", void 0);
__decorate([
    (0, graphql_1.Field)(() => [graphql_1.Int], { nullable: true }),
    __metadata("design:type", Array)
], RepeatShiftInput.prototype, "daysOfWeek", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: true }),
    __metadata("design:type", Boolean)
], RepeatShiftInput.prototype, "isOpen", void 0);
exports.RepeatShiftInput = RepeatShiftInput = __decorate([
    (0, graphql_1.InputType)()
], RepeatShiftInput);
//# sourceMappingURL=repeat-shift.input.js.map