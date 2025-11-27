import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { ShiftCancellation } from './shift-cancellation.entity';
import { CreateAssignmentInput } from './dto/create-assignment.input';
import { CancelAssignmentInput } from './dto/cancel-assignment.input';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { AssignmentFilterInput } from './dto/assignment-filter.input';
import { IPaginatedType } from '../common/pagination/paginated.result';
import { paginate } from '../common/utils/paginate';
import { User } from '../users/user.entity';

@Injectable()
export class AssignmentsService {
    constructor(
        @InjectRepository(Assignment)
        private assignmentsRepository: Repository<Assignment>,
        @InjectRepository(ShiftCancellation)
        private cancellationsRepository: Repository<ShiftCancellation>,
    ) { }

    async create(createAssignmentInput: CreateAssignmentInput): Promise<Assignment> {
        const assignment = this.assignmentsRepository.create(createAssignmentInput);
        const saved = await this.assignmentsRepository.save(assignment);

        // Load the relations (user and shift) before returning
        const result = await this.assignmentsRepository.findOne({
            where: { id: saved.id },
            relations: ['user', 'shift'],
        });

        if (!result) {
            throw new Error('Failed to create assignment');
        }

        return result;
    }

    async findAll(paginationArgs: PaginationArgs, filter: AssignmentFilterInput, user: User): Promise<IPaginatedType<Assignment>> {
        const query = this.assignmentsRepository.createQueryBuilder('assignment')
            .leftJoinAndSelect('assignment.user', 'user')
            .leftJoinAndSelect('assignment.shift', 'shift');

        // Non-admin users can only see their own assignments
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
            // Assuming we want to filter assignments where the shift starts on a specific date
            // This requires joining with shift, which is already done
            query.andWhere('shift.startTime::date = :date', { date: filter.date });
        }

        if (filter.startDate) {
            query.andWhere('shift.startTime >= :startDate', { startDate: filter.startDate });
        }

        if (filter.endDate) {
            query.andWhere('shift.startTime <= :endDate', { endDate: filter.endDate });
        }

        return paginate(query, paginationArgs);
    }

    async findOne(id: string, user: User): Promise<Assignment | null> {
        const assignment = await this.assignmentsRepository.findOne({
            where: { id },
            relations: ['user', 'shift'],
        });

        if (!assignment) {
            throw new NotFoundException('Assignment not found');
        }

        // Non-admin users can only view their own assignments
        if (user.role !== 'admin' && assignment.userId !== user.id) {
            throw new ForbiddenException('You can only view your own assignments');
        }

        return assignment;
    }

    async cancelAssignment(input: CancelAssignmentInput, user: User): Promise<boolean> {
        const assignment = await this.assignmentsRepository.findOne({
            where: { id: input.assignmentId },
            relations: ['user', 'shift'],
        });

        if (!assignment) {
            throw new NotFoundException('Assignment not found');
        }

        // Non-admin users can only cancel their own assignments
        if (user.role !== 'admin' && assignment.userId !== user.id) {
            throw new ForbiddenException('You can only cancel your own assignments');
        }

        // Create cancellation record
        await this.cancellationsRepository.save({
            userId: assignment.userId,
            shiftId: assignment.shiftId,
            reason: input.reason,
        });

        // Remove the assignment
        await this.assignmentsRepository.delete(input.assignmentId);

        return true;
    }

    async remove(id: string): Promise<void> {
        await this.assignmentsRepository.delete(id);
    }
}
