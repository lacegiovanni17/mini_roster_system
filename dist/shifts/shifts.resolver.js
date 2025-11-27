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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const shifts_service_1 = require("./shifts.service");
const shift_entity_1 = require("./shift.entity");
const create_shift_input_1 = require("./dto/create-shift.input");
const repeat_shift_input_1 = require("./dto/repeat-shift.input");
const pagination_args_1 = require("../common/pagination/pagination.args");
const shift_filter_input_1 = require("./dto/shift-filter.input");
const paginated_shift_1 = require("./dto/paginated-shift");
const gql_auth_guard_1 = require("../auth/guards/gql-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let ShiftsResolver = class ShiftsResolver {
    shiftsService;
    constructor(shiftsService) {
        this.shiftsService = shiftsService;
    }
    createShift(createShiftInput) {
        return this.shiftsService.create(createShiftInput);
    }
    findAll(paginationArgs, filter = {}) {
        return this.shiftsService.findAll(paginationArgs, filter);
    }
    findOpenShifts(paginationArgs) {
        return this.shiftsService.findOpenShifts(paginationArgs);
    }
    findOne(id) {
        return this.shiftsService.findOne(id);
    }
    async removeShift(id) {
        await this.shiftsService.remove(id);
        return true;
    }
    repeatShift(input) {
        return this.shiftsService.repeatShift(input);
    }
};
exports.ShiftsResolver = ShiftsResolver;
__decorate([
    (0, graphql_1.Mutation)(() => shift_entity_1.Shift),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, graphql_1.Args)('createShiftInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_shift_input_1.CreateShiftInput]),
    __metadata("design:returntype", void 0)
], ShiftsResolver.prototype, "createShift", null);
__decorate([
    (0, graphql_1.Query)(() => paginated_shift_1.PaginatedShift, { name: 'shifts' }),
    (0, roles_decorator_1.Roles)('admin', 'user'),
    __param(0, (0, graphql_1.Args)()),
    __param(1, (0, graphql_1.Args)('filter', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_args_1.PaginationArgs,
        shift_filter_input_1.ShiftFilterInput]),
    __metadata("design:returntype", void 0)
], ShiftsResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => paginated_shift_1.PaginatedShift, { name: 'openShifts' }),
    (0, roles_decorator_1.Roles)('admin', 'user'),
    __param(0, (0, graphql_1.Args)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_args_1.PaginationArgs]),
    __metadata("design:returntype", void 0)
], ShiftsResolver.prototype, "findOpenShifts", null);
__decorate([
    (0, graphql_1.Query)(() => shift_entity_1.Shift, { name: 'shift' }),
    (0, roles_decorator_1.Roles)('admin', 'user'),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShiftsResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShiftsResolver.prototype, "removeShift", null);
__decorate([
    (0, graphql_1.Mutation)(() => [shift_entity_1.Shift]),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [repeat_shift_input_1.RepeatShiftInput]),
    __metadata("design:returntype", void 0)
], ShiftsResolver.prototype, "repeatShift", null);
exports.ShiftsResolver = ShiftsResolver = __decorate([
    (0, graphql_1.Resolver)(() => shift_entity_1.Shift),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [shifts_service_1.ShiftsService])
], ShiftsResolver);
//# sourceMappingURL=shifts.resolver.js.map