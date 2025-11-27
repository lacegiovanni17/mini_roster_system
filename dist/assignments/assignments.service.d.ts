import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { ShiftCancellation } from './shift-cancellation.entity';
import { CreateAssignmentInput } from './dto/create-assignment.input';
import { CancelAssignmentInput } from './dto/cancel-assignment.input';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { AssignmentFilterInput } from './dto/assignment-filter.input';
import { IPaginatedType } from '../common/pagination/paginated.result';
import { User } from '../users/user.entity';
export declare class AssignmentsService {
    private assignmentsRepository;
    private cancellationsRepository;
    constructor(assignmentsRepository: Repository<Assignment>, cancellationsRepository: Repository<ShiftCancellation>);
    create(createAssignmentInput: CreateAssignmentInput): Promise<Assignment>;
    findAll(paginationArgs: PaginationArgs, filter: AssignmentFilterInput, user: User): Promise<IPaginatedType<Assignment>>;
    findOne(id: string, user: User): Promise<Assignment | null>;
    cancelAssignment(input: CancelAssignmentInput, user: User): Promise<boolean>;
    remove(id: string): Promise<void>;
}
