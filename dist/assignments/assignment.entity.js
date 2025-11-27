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
exports.Assignment = void 0;
const typeorm_1 = require("typeorm");
const graphql_1 = require("@nestjs/graphql");
const user_entity_1 = require("../users/user.entity");
const shift_entity_1 = require("../shifts/shift.entity");
let Assignment = class Assignment {
    id;
    user;
    userId;
    shift;
    shiftId;
    createdAt;
    updatedAt;
};
exports.Assignment = Assignment;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Assignment.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => user_entity_1.User),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.assignments, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Assignment.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Assignment.prototype, "userId", void 0);
__decorate([
    (0, graphql_1.Field)(() => shift_entity_1.Shift),
    (0, typeorm_1.ManyToOne)(() => shift_entity_1.Shift, (shift) => shift.assignments, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'shiftId' }),
    __metadata("design:type", shift_entity_1.Shift)
], Assignment.prototype, "shift", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Assignment.prototype, "shiftId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Assignment.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Assignment.prototype, "updatedAt", void 0);
exports.Assignment = Assignment = __decorate([
    (0, graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Assignment);
//# sourceMappingURL=assignment.entity.js.map