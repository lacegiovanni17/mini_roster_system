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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const paginate_1 = require("../common/utils/paginate");
let UsersService = class UsersService {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    create(createUserInput) {
        const user = this.usersRepository.create(createUserInput);
        return this.usersRepository.save(user);
    }
    async findAll(paginationArgs, filter) {
        const query = this.usersRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.assignments', 'assignments');
        if (filter.name) {
            query.andWhere('user.name ILIKE :name', { name: `%${filter.name}%` });
        }
        if (filter.email) {
            query.andWhere('user.email ILIKE :email', { email: `%${filter.email}%` });
        }
        if (filter.role) {
            query.andWhere('user.role = :role', { role: filter.role });
        }
        return (0, paginate_1.paginate)(query, paginationArgs);
    }
    findOne(id) {
        return this.usersRepository.findOne({ where: { id }, relations: ['assignments'] });
    }
    async remove(id) {
        await this.usersRepository.delete(id);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map