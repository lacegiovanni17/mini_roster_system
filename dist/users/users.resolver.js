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
exports.UsersResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const users_service_1 = require("./users.service");
const user_entity_1 = require("./user.entity");
const create_user_input_1 = require("./dto/create-user.input");
const pagination_args_1 = require("../common/pagination/pagination.args");
const user_filter_input_1 = require("./dto/user-filter.input");
const paginated_user_1 = require("./dto/paginated-user");
let UsersResolver = class UsersResolver {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    createUser(createUserInput) {
        return this.usersService.create(createUserInput);
    }
    findAll(paginationArgs, filter = {}) {
        return this.usersService.findAll(paginationArgs, filter);
    }
    findOne(id) {
        return this.usersService.findOne(id);
    }
    async removeUser(id) {
        await this.usersService.remove(id);
        return true;
    }
};
exports.UsersResolver = UsersResolver;
__decorate([
    (0, graphql_1.Mutation)(() => user_entity_1.User),
    __param(0, (0, graphql_1.Args)("createUserInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_input_1.CreateUserInput]),
    __metadata("design:returntype", void 0)
], UsersResolver.prototype, "createUser", null);
__decorate([
    (0, graphql_1.Query)(() => paginated_user_1.PaginatedUser, { name: "users" }),
    __param(0, (0, graphql_1.Args)()),
    __param(1, (0, graphql_1.Args)("filter", { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_args_1.PaginationArgs,
        user_filter_input_1.UserFilterInput]),
    __metadata("design:returntype", void 0)
], UsersResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => user_entity_1.User, { name: "user" }),
    __param(0, (0, graphql_1.Args)("id", { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)("id", { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersResolver.prototype, "removeUser", null);
exports.UsersResolver = UsersResolver = __decorate([
    (0, graphql_1.Resolver)(() => user_entity_1.User),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersResolver);
//# sourceMappingURL=users.resolver.js.map