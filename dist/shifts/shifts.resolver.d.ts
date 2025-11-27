import { ShiftsService } from './shifts.service';
import { Shift } from './shift.entity';
import { CreateShiftInput } from './dto/create-shift.input';
import { RepeatShiftInput } from './dto/repeat-shift.input';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { ShiftFilterInput } from './dto/shift-filter.input';
export declare class ShiftsResolver {
    private readonly shiftsService;
    constructor(shiftsService: ShiftsService);
    createShift(createShiftInput: CreateShiftInput): Promise<Shift>;
    findAll(paginationArgs: PaginationArgs, filter?: ShiftFilterInput): Promise<import("../common/pagination/paginated.result").IPaginatedType<Shift>>;
    findOpenShifts(paginationArgs: PaginationArgs): Promise<import("../common/pagination/paginated.result").IPaginatedType<Shift>>;
    findOne(id: string): Promise<Shift | null>;
    removeShift(id: string): Promise<boolean>;
    repeatShift(input: RepeatShiftInput): Promise<Shift[]>;
}
