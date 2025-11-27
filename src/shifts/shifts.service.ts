import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shift } from './shift.entity';
import { CreateShiftInput } from './dto/create-shift.input';
import { RepeatShiftInput } from './dto/repeat-shift.input';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { ShiftFilterInput } from './dto/shift-filter.input';
import { IPaginatedType } from '../common/pagination/paginated.result';
import { paginate } from '../common/utils/paginate';
import { Assignment } from '../assignments/assignment.entity';

@Injectable()
export class ShiftsService {
    constructor(
        @InjectRepository(Shift)
        private shiftsRepository: Repository<Shift>,
        @InjectRepository(Assignment)
        private assignmentsRepository: Repository<Assignment>,
    ) { }

    create(createShiftInput: CreateShiftInput): Promise<Shift> {
        const { date, timeSlot, isOpen } = createShiftInput;

        // Calculate startTime and endTime based on timeSlot
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

    private calculateStartTime(date: string, timeSlot: string): Date {
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

    private calculateEndTime(date: string, timeSlot: string): Date {
        const baseDate = new Date(date);

        switch (timeSlot) {
            case 'morning':
                baseDate.setHours(14, 0, 0, 0);
                break;
            case 'afternoon':
                baseDate.setHours(22, 0, 0, 0);
                break;
            case 'night':
                // Night shift ends at 6am next day
                baseDate.setDate(baseDate.getDate() + 1);
                baseDate.setHours(6, 0, 0, 0);
                break;
        }

        return baseDate;
    }
    async findAll(paginationArgs: PaginationArgs, filter: ShiftFilterInput): Promise<IPaginatedType<Shift>> {
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

        return paginate(query, paginationArgs);
    }

    async findOpenShifts(paginationArgs: PaginationArgs): Promise<IPaginatedType<Shift>> {
        const query = this.shiftsRepository.createQueryBuilder('shift')
            .where('shift.isOpen = :isOpen', { isOpen: true })
            .leftJoinAndSelect('shift.assignments', 'assignments');

        return paginate(query, paginationArgs);
    }

    findOne(id: string): Promise<Shift | null> {
        return this.shiftsRepository.findOne({ where: { id }, relations: ['assignments'] });
    }

    async remove(id: string): Promise<void> {
        await this.shiftsRepository.delete(id);
    }

    async repeatShift(input: RepeatShiftInput): Promise<Shift[]> {
        const shifts: Shift[] = [];
        const start = new Date(input.startDate);
        const end = new Date(input.endDate);

        // Iterate through each day in the range
        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            // Skip if daysOfWeek specified and current day not included
            if (input.daysOfWeek && input.daysOfWeek.length > 0) {
                if (!input.daysOfWeek.includes(date.getDay())) {
                    continue;
                }
            }

            // Create shift for this date
            const shift = await this.create({
                date: date.toISOString().split('T')[0],
                timeSlot: input.timeSlot,
                isOpen: input.isOpen,
            });

            // If userId provided, automatically assign user to this shift
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
}
