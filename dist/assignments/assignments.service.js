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
exports.AssignmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const assignment_entity_1 = require("./assignment.entity");
const shift_cancellation_entity_1 = require("./shift-cancellation.entity");
const paginate_1 = require("../common/utils/paginate");
let AssignmentsService = class AssignmentsService {
    assignmentsRepository;
    cancellationsRepository;
    constructor(assignmentsRepository, cancellationsRepository) {
        this.assignmentsRepository = assignmentsRepository;
        this.cancellationsRepository = cancellationsRepository;
    }
    async create(createAssignmentInput) {
        const assignment = this.assignmentsRepository.create(createAssignmentInput);
        const saved = await this.assignmentsRepository.save(assignment);
        const result = await this.assignmentsRepository.findOne({
            where: { id: saved.id },
            relations: ['user', 'shift'],
        });
        if (!result) {
            throw new Error('Failed to create assignment');
        }
        return result;
    }
    async findAll(paginationArgs, filter, user) {
        const query = this.assignmentsRepository.createQueryBuilder('assignment')
            .leftJoinAndSelect('assignment.user', 'user')
            .leftJoinAndSelect('assignment.shift', 'shift');
        if (user.role !== 'admin') {
            query.andWhere('assignment.userId = :currentUserId', { currentUserId: user.id });
        }
        if (filter.userId) {
            query.andWhere('assignment.userId = :userId', { userId: filter.userId });
        }
        if (filter.shiftId) {
            query.andWhere('assignment.shiftId = :shiftId', { shiftId: filter.shiftId });
        }
        if (filter.date) {
            query.andWhere('shift.startTime::date = :date', { date: filter.date });
        }
        if (filter.startDate) {
            query.andWhere('shift.startTime >= :startDate', { startDate: filter.startDate });
        }
        if (filter.endDate) {
            query.andWhere('shift.startTime <= :endDate', { endDate: filter.endDate });
        }
        return (0, paginate_1.paginate)(query, paginationArgs);
    }
    async findOne(id, user) {
        const assignment = await this.assignmentsRepository.findOne({
            where: { id },
            relations: ['user', 'shift'],
        });
        if (!assignment) {
            throw new common_1.NotFoundException('Assignment not found');
        }
        if (user.role !== 'admin' && assignment.userId !== user.id) {
            throw new common_1.ForbiddenException('You can only view your own assignments');
        }
        return assignment;
    }
    async cancelAssignment(input, user) {
        const assignment = await this.assignmentsRepository.findOne({
            where: { id: input.assignmentId },
            relations: ['user', 'shift'],
        });
        if (!assignment) {
            throw new common_1.NotFoundException('Assignment not found');
        }
        if (user.role !== 'admin' && assignment.userId !== user.id) {
            throw new common_1.ForbiddenException('You can only cancel your own assignments');
        }
        await this.cancellationsRepository.save({
            userId: assignment.userId,
            shiftId: assignment.shiftId,
            reason: input.reason,
        });
        await this.assignmentsRepository.delete(input.assignmentId);
        return true;
    }
    async remove(id) {
        await this.assignmentsRepository.delete(id);
    }
};
exports.AssignmentsService = AssignmentsService;
exports.AssignmentsService = AssignmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(assignment_entity_1.Assignment)),
    __param(1, (0, typeorm_1.InjectRepository)(shift_cancellation_entity_1.ShiftCancellation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AssignmentsService);
//# sourceMappingURL=assignments.service.js.map