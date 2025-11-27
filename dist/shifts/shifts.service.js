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
exports.ShiftsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const shift_entity_1 = require("./shift.entity");
const paginate_1 = require("../common/utils/paginate");
const assignment_entity_1 = require("../assignments/assignment.entity");
let ShiftsService = class ShiftsService {
    shiftsRepository;
    assignmentsRepository;
    constructor(shiftsRepository, assignmentsRepository) {
        this.shiftsRepository = shiftsRepository;
        this.assignmentsRepository = assignmentsRepository;
    }
    create(createShiftInput) {
        const { date, timeSlot, isOpen } = createShiftInput;
        const startTime = this.calculateStartTime(date, timeSlot);
        const endTime = this.calculateEndTime(date, timeSlot);
        const shift = this.shiftsRepository.create({
            startTime,
            endTime,
            timeSlot,
            isOpen,
        });
        return this.shiftsRepository.save(shift);
    }
    calculateStartTime(date, timeSlot) {
        const baseDate = new Date(date);
        switch (timeSlot) {
            case 'morning':
                baseDate.setHours(6, 0, 0, 0);
                break;
            case 'afternoon':
                baseDate.setHours(14, 0, 0, 0);
                break;
            case 'night':
                baseDate.setHours(22, 0, 0, 0);
                break;
        }
        return baseDate;
    }
    calculateEndTime(date, timeSlot) {
        const baseDate = new Date(date);
        switch (timeSlot) {
            case 'morning':
                baseDate.setHours(14, 0, 0, 0);
                break;
            case 'afternoon':
                baseDate.setHours(22, 0, 0, 0);
                break;
            case 'night':
                baseDate.setDate(baseDate.getDate() + 1);
                baseDate.setHours(6, 0, 0, 0);
                break;
        }
        return baseDate;
    }
    async findAll(paginationArgs, filter) {
        const query = this.shiftsRepository.createQueryBuilder('shift')
            .leftJoinAndSelect('shift.assignments', 'assignments');
        if (filter.isOpen !== undefined) {
            query.andWhere('shift.isOpen = :isOpen', { isOpen: filter.isOpen });
        }
        if (filter.startDate) {
            query.andWhere('shift.startTime >= :startDate', { startDate: filter.startDate });
        }
        if (filter.endDate) {
            query.andWhere('shift.endTime <= :endDate', { endDate: filter.endDate });
        }
        if (filter.timeSlot) {
            query.andWhere('shift.timeSlot = :timeSlot', { timeSlot: filter.timeSlot });
        }
        return (0, paginate_1.paginate)(query, paginationArgs);
    }
    async findOpenShifts(paginationArgs) {
        const query = this.shiftsRepository.createQueryBuilder('shift')
            .where('shift.isOpen = :isOpen', { isOpen: true })
            .leftJoinAndSelect('shift.assignments', 'assignments');
        return (0, paginate_1.paginate)(query, paginationArgs);
    }
    findOne(id) {
        return this.shiftsRepository.findOne({ where: { id }, relations: ['assignments'] });
    }
    async remove(id) {
        await this.shiftsRepository.delete(id);
    }
    async repeatShift(input) {
        const shifts = [];
        const start = new Date(input.startDate);
        const end = new Date(input.endDate);
        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            if (input.daysOfWeek && input.daysOfWeek.length > 0) {
                if (!input.daysOfWeek.includes(date.getDay())) {
                    continue;
                }
            }
            const shift = await this.create({
                date: date.toISOString().split('T')[0],
                timeSlot: input.timeSlot,
                isOpen: input.isOpen,
            });
            if (input.userId) {
                await this.assignmentsRepository.save({
                    userId: input.userId,
                    shiftId: shift.id,
                });
            }
            shifts.push(shift);
        }
        return shifts;
    }
};
exports.ShiftsService = ShiftsService;
exports.ShiftsService = ShiftsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(shift_entity_1.Shift)),
    __param(1, (0, typeorm_1.InjectRepository)(assignment_entity_1.Assignment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ShiftsService);
//# sourceMappingURL=shifts.service.js.map