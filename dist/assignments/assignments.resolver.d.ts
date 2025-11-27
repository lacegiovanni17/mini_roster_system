import { AssignmentsService } from './assignments.service';
import { Assignment } from './assignment.entity';
import { CreateAssignmentInput } from './dto/create-assignment.input';
import { CancelAssignmentInput } from './dto/cancel-assignment.input';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { AssignmentFilterInput } from './dto/assignment-filter.input';
import { User } from '../users/user.entity';
export declare class AssignmentsResolver {
    private readonly assignmentsService;
    constructor(assignmentsService: AssignmentsService);
    createAssignment(createAssignmentInput: CreateAssignmentInput): Promise<Assignment>;
    findAll(paginationArgs: PaginationArgs, filter: AssignmentFilterInput | undefined, user: User): Promise<import("../common/pagination/paginated.result").IPaginatedType<Assignment>>;
    findOne(id: string, user: User): Promise<Assignment | null>;
    cancelAssignment(input: CancelAssignmentInput, user: User): Promise<boolean>;
    removeAssignment(id: string): Promise<boolean>;
}
