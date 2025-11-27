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
exports.ShiftCancellation = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const user_entity_1 = require("../users/user.entity");
const shift_entity_1 = require("../shifts/shift.entity");
let ShiftCancellation = class ShiftCancellation {
    id;
    userId;
    user;
    shiftId;
    shift;
    reason;
    cancelledAt;
    updatedAt;
};
exports.ShiftCancellation = ShiftCancellation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], ShiftCancellation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ShiftCancellation.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, graphql_1.Field)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], ShiftCancellation.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ShiftCancellation.prototype, "shiftId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => shift_entity_1.Shift),
    (0, graphql_1.Field)(() => shift_entity_1.Shift),
    __metadata("design:type", shift_entity_1.Shift)
], ShiftCancellation.prototype, "shift", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ShiftCancellation.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], ShiftCancellation.prototype, "cancelledAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ShiftCancellation.prototype, "updatedAt", void 0);
exports.ShiftCancellation = ShiftCancellation = __decorate([
    (0, typeorm_1.Entity)(),
    (0, graphql_1.ObjectType)()
], ShiftCancellation);
//# sourceMappingURL=shift-cancellation.entity.js.map