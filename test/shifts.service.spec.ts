import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ShiftsService } from '../src/shifts/shifts.service';
import { Shift } from '../src/shifts/shift.entity';
import { Assignment } from '../src/assignments/assignment.entity';
import { CreateShiftInput } from '../src/shifts/dto/create-shift.input';
import { RepeatShiftInput } from '../src/shifts/dto/repeat-shift.input';
import { PaginationArgs } from '../src/common/pagination/pagination.args';
import { ShiftFilterInput } from '../src/shifts/dto/shift-filter.input';
import { TimeSlot } from 'src/shifts/enums/time-slot.enum';

// Mock the paginate utility
jest.mock('../src/common/utils/paginate', () => ({
    paginate: jest.fn((query, paginationArgs) => {
        return Promise.resolve({
            items: [],
            total: 0,
        });
    }),
}));

describe('ShiftsService', () => {
    let service: ShiftsService;
    let shiftsRepository: Repository<Shift>;
    let assignmentsRepository: Repository<Assignment>;

    const mockShift: Shift = {
        id: '1',
        startTime: new Date('2025-11-26T06:00:00'),
        endTime: new Date('2025-11-26T14:00:00'),
        timeSlot: TimeSlot.MORNING,
        isOpen: true,
        assignments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockShiftsRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        delete: jest.fn(),
        createQueryBuilder: jest.fn(),
    };

    const mockAssignmentsRepository = {
        save: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ShiftsService,
                {
                    provide: getRepositoryToken(Shift),
                    useValue: mockShiftsRepository,
                },
                {
                    provide: getRepositoryToken(Assignment),
                    useValue: mockAssignmentsRepository,
                },
            ],
        }).compile();

        service = module.get<ShiftsService>(ShiftsService);
        shiftsRepository = module.get<Repository<Shift>>(getRepositoryToken(Shift));
        assignmentsRepository = module.get<Repository<Assignment>>(getRepositoryToken(Assignment));

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a morning shift', async () => {
            const createShiftInput: CreateShiftInput = {
                date: '2025-11-26',
                timeSlot: TimeSlot.MORNING,
                isOpen: true,
            };

            mockShiftsRepository.create.mockReturnValue(mockShift);
            mockShiftsRepository.save.mockResolvedValue(mockShift);

            const result = await service.create(createShiftInput);

            expect(result).toEqual(mockShift);
            expect(mockShiftsRepository.create).toHaveBeenCalledWith({
                startTime: expect.any(Date),
                endTime: expect.any(Date),
                timeSlot: 'morning',
                isOpen: true,
            });
            expect(mockShiftsRepository.save).toHaveBeenCalled();
        });

        it('should create an afternoon shift', async () => {
            const createShiftInput: CreateShiftInput = {
                date: '2025-11-26',
                timeSlot: TimeSlot.AFTERNOON,
                isOpen: false,
            };

            const afternoonShift = { ...mockShift, timeSlot: TimeSlot.AFTERNOON };
            mockShiftsRepository.create.mockReturnValue(afternoonShift);
            mockShiftsRepository.save.mockResolvedValue(afternoonShift);

            const result = await service.create(createShiftInput);

            expect(result.timeSlot).toBe('afternoon');
            expect(mockShiftsRepository.save).toHaveBeenCalled();
        });

        it('should create a night shift', async () => {
            const createShiftInput: CreateShiftInput = {
                date: '2025-11-26',
                timeSlot: TimeSlot.NIGHT,
                isOpen: true,
            };

            const nightShift = { ...mockShift, timeSlot: TimeSlot.NIGHT };
            mockShiftsRepository.create.mockReturnValue(nightShift);
            mockShiftsRepository.save.mockResolvedValue(nightShift);

            const result = await service.create(createShiftInput);

            expect(result.timeSlot).toBe('night');
            expect(mockShiftsRepository.save).toHaveBeenCalled();
        });
    });

    describe('findAll', () => {
        it('should return paginated shifts without filters', async () => {
            const paginationArgs: PaginationArgs = { limit: 10, page: 0 };
            const filter: ShiftFilterInput = {};

            const mockQueryBuilder = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
            } as unknown as SelectQueryBuilder<Shift>;

            mockShiftsRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            const result = await service.findAll(paginationArgs, filter);

            expect(mockShiftsRepository.createQueryBuilder).toHaveBeenCalledWith('shift');
            expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('shift.assignments', 'assignments');
            expect(result).toHaveProperty('items');
            expect(result).toHaveProperty('total');
        });

        it('should filter shifts by isOpen', async () => {
            const paginationArgs: PaginationArgs = { limit: 10, page: 0 };
            const filter: ShiftFilterInput = { isOpen: true };

            const mockQueryBuilder = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
            } as unknown as SelectQueryBuilder<Shift>;

            mockShiftsRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            await service.findAll(paginationArgs, filter);

            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('shift.isOpen = :isOpen', { isOpen: true });
        });

        it('should filter shifts by startDate', async () => {
            const paginationArgs: PaginationArgs = { limit: 10, page: 0 };
            const filter: ShiftFilterInput = { startDate: '2025-11-26' };

            const mockQueryBuilder = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
            } as unknown as SelectQueryBuilder<Shift>;

            mockShiftsRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            await service.findAll(paginationArgs, filter);

            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('shift.startTime >= :startDate', { startDate: '2025-11-26' });
        });

        it('should filter shifts by endDate', async () => {
            const paginationArgs: PaginationArgs = { limit: 10, page: 0 };
            const filter: ShiftFilterInput = { endDate: '2025-11-30' };

            const mockQueryBuilder = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
            } as unknown as SelectQueryBuilder<Shift>;

            mockShiftsRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            await service.findAll(paginationArgs, filter);

            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('shift.endTime <= :endDate', { endDate: '2025-11-30' });
        });

        it('should filter shifts by timeSlot', async () => {
            const paginationArgs: PaginationArgs = { limit: 10, page: 0 };
            const filter: ShiftFilterInput = { timeSlot: TimeSlot.MORNING };

            const mockQueryBuilder = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
            } as unknown as SelectQueryBuilder<Shift>;

            mockShiftsRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            await service.findAll(paginationArgs, filter);

            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('shift.timeSlot = :timeSlot', { timeSlot: 'morning' });
        });
    });

    describe('findOpenShifts', () => {
        it('should return only open shifts', async () => {
            const paginationArgs: PaginationArgs = { limit: 10, page: 0 };

            const mockQueryBuilder = {
                where: jest.fn().mockReturnThis(),
                leftJoinAndSelect: jest.fn().mockReturnThis(),
            } as unknown as SelectQueryBuilder<Shift>;

            mockShiftsRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            const result = await service.findOpenShifts(paginationArgs);

            expect(mockShiftsRepository.createQueryBuilder).toHaveBeenCalledWith('shift');
            expect(mockQueryBuilder.where).toHaveBeenCalledWith('shift.isOpen = :isOpen', { isOpen: true });
            expect(result).toHaveProperty('items');
            expect(result).toHaveProperty('total');
        });
    });

    describe('findOne', () => {
        it('should return a shift by id', async () => {
            mockShiftsRepository.findOne.mockResolvedValue(mockShift);

            const result = await service.findOne('1');

            expect(result).toEqual(mockShift);
            expect(mockShiftsRepository.findOne).toHaveBeenCalledWith({
                where: { id: '1' },
                relations: ['assignments'],
            });
        });

        it('should return null if shift not found', async () => {
            mockShiftsRepository.findOne.mockResolvedValue(null);

            const result = await service.findOne('999');

            expect(result).toBeNull();
        });
    });

    describe('remove', () => {
        it('should delete a shift', async () => {
            mockShiftsRepository.delete.mockResolvedValue({ affected: 1 });

            await service.remove('1');

            expect(mockShiftsRepository.delete).toHaveBeenCalledWith('1');
        });
    });

    describe('repeatShift', () => {
        it('should create multiple shifts for a date range', async () => {
            const input: RepeatShiftInput = {
                startDate: '2025-11-26',
                endDate: '2025-11-28',
                timeSlot: TimeSlot.MORNING,
                isOpen: true,
            };

            mockShiftsRepository.create.mockReturnValue(mockShift);
            mockShiftsRepository.save.mockResolvedValue(mockShift);

            const result = await service.repeatShift(input);

            expect(result.length).toBeGreaterThan(0);
            expect(mockShiftsRepository.save).toHaveBeenCalled();
        });

        it('should create shifts only for specified days of week', async () => {
            const input: RepeatShiftInput = {
                startDate: '2025-11-24', // Monday
                endDate: '2025-11-30', // Sunday
                timeSlot: TimeSlot.MORNING,
                isOpen: true,
                daysOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
            };

            mockShiftsRepository.create.mockReturnValue(mockShift);
            mockShiftsRepository.save.mockResolvedValue(mockShift);

            const result = await service.repeatShift(input);

            expect(result.length).toBeGreaterThan(0);
            expect(mockShiftsRepository.save).toHaveBeenCalled();
        });

        it('should auto-assign user if userId provided', async () => {
            const input: RepeatShiftInput = {
                startDate: '2025-11-26',
                endDate: '2025-11-26',
                timeSlot: TimeSlot.MORNING,
                isOpen: false,
                userId: 'user-123',
            };

            mockShiftsRepository.create.mockReturnValue(mockShift);
            mockShiftsRepository.save.mockResolvedValue(mockShift);
            mockAssignmentsRepository.save.mockResolvedValue({});

            const result = await service.repeatShift(input);

            expect(result.length).toBeGreaterThan(0);
            expect(mockAssignmentsRepository.save).toHaveBeenCalledWith({
                userId: 'user-123',
                shiftId: mockShift.id,
            });
        });
    });
});
