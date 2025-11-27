import { Repository } from 'typeorm';
import { Shift } from './shift.entity';
import { CreateShiftInput } from './dto/create-shift.input';
import { RepeatShiftInput } from './dto/repeat-shift.input';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { ShiftFilterInput } from './dto/shift-filter.input';
import { IPaginatedType } from '../common/pagination/paginated.result';
import { Assignment } from '../assignments/assignment.entity';
export declare class ShiftsService {
    private shiftsRepository;
    private assignmentsRepository;
    constructor(shiftsRepository: Repository<Shift>, assignmentsRepository: Repository<Assignment>);
    create(createShiftInput: CreateShiftInput): Promise<Shift>;
    private calculateStartTime;
    private calculateEndTime;
    findAll(paginationArgs: PaginationArgs, filter: ShiftFilterInput): Promise<IPaginatedType<Shift>>;
    findOpenShifts(paginationArgs: PaginationArgs): Promise<IPaginatedType<Shift>>;
    findOne(id: string): Promise<Shift | null>;
    remove(id: string): Promise<void>;
    repeatShift(input: RepeatShiftInput): Promise<Shift[]>;
}
