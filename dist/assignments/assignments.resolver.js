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
exports.AssignmentsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const assignments_service_1 = require("./assignments.service");
const assignment_entity_1 = require("./assignment.entity");
const create_assignment_input_1 = require("./dto/create-assignment.input");
const cancel_assignment_input_1 = require("./dto/cancel-assignment.input");
const pagination_args_1 = require("../common/pagination/pagination.args");
const assignment_filter_input_1 = require("./dto/assignment-filter.input");
const paginated_assignment_1 = require("./dto/paginated-assignment");
const gql_auth_guard_1 = require("../auth/guards/gql-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_entity_1 = require("../users/user.entity");
let AssignmentsResolver = class AssignmentsResolver {
    assignmentsService;
    constructor(assignmentsService) {
        this.assignmentsService = assignmentsService;
    }
    createAssignment(createAssignmentInput) {
        return this.assignmentsService.create(createAssignmentInput);
    }
    findAll(paginationArgs, filter = {}, user) {
        return this.assignmentsService.findAll(paginationArgs, filter, user);
    }
    findOne(id, user) {
        return this.assignmentsService.findOne(id, user);
    }
    async cancelAssignment(input, user) {
        return this.assignmentsService.cancelAssignment(input, user);
    }
    async removeAssignment(id) {
        await this.assignmentsService.remove(id);
        return true;
    }
};
exports.AssignmentsResolver = AssignmentsResolver;
__decorate([
    (0, graphql_1.Mutation)(() => assignment_entity_1.Assignment),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, graphql_1.Args)('createAssignmentInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_assignment_input_1.CreateAssignmentInput]),
    __metadata("design:returntype", void 0)
], AssignmentsResolver.prototype, "createAssignment", null);
__decorate([
    (0, graphql_1.Query)(() => paginated_assignment_1.PaginatedAssignment, { name: 'assignments' }),
    (0, roles_decorator_1.Roles)('admin', 'user'),
    __param(0, (0, graphql_1.Args)()),
    __param(1, (0, graphql_1.Args)('filter', { nullable: true })),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_args_1.PaginationArgs,
        assignment_filter_input_1.AssignmentFilterInput,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], AssignmentsResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => assignment_entity_1.Assignment, { name: 'assignment' }),
    (0, roles_decorator_1.Roles)('admin', 'user'),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], AssignmentsResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, roles_decorator_1.Roles)('admin', 'user'),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cancel_assignment_input_1.CancelAssignmentInput,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AssignmentsResolver.prototype, "cancelAssignment", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AssignmentsResolver.prototype, "removeAssignment", null);
exports.AssignmentsResolver = AssignmentsResolver = __decorate([
    (0, graphql_1.Resolver)(() => assignment_entity_1.Assignment),
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [assignments_service_1.AssignmentsService])
], AssignmentsResolver);
//# sourceMappingURL=assignments.resolver.js.map