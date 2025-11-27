import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { AssignmentsService } from '../src/assignments/assignments.service';
import { Assignment } from '../src/assignments/assignment.entity';
import { ShiftCancellation } from '../src/assignments/shift-cancellation.entity';
import { User } from '../src/users/user.entity';
import { CreateAssignmentInput } from '../src/assignments/dto/create-assignment.input';
import { CancelAssignmentInput } from '../src/assignments/dto/cancel-assignment.input';
import { PaginationArgs } from '../src/common/pagination/pagination.args';
import { AssignmentFilterInput } from '../src/assignments/dto/assignment-filter.input';
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

describe('AssignmentsService', () => {
    let service: AssignmentsService;
    let assignmentsRepository: Repository<Assignment>;
    let cancellationsRepository: Repository<ShiftCancellation>;

    const mockUser: User = {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
        assignments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockAdminUser: User = {
        ...mockUser,
        id: 'admin-1',
        role: 'admin',
    };

    const mockAssignment: Assignment = {
        id: 'assignment-1',
        userId: 'user-1',
        shiftId: 'shift-1',
        user: mockUser,
        shift: {
            id: 'shift-1',
            startTime: new Date('2025-11-26T06:00:00'),
            endTime: new Date('2025-11-26T14:00:00'),
            timeSlot: TimeSlot.MORNING,
            isOpen: false,
            assignments: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockAssignmentsRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        delete: jest.fn(),
        createQueryBuilder: jest.fn(),
    };

    const mockCancellationsRepository = {
        save: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AssignmentsService,
                {
                    provide: getRepositoryToken(Assignment),
                    useValue: mockAssignmentsRepository,
                },
                {
                    provide: getRepositoryToken(ShiftCancellation),
                    useValue: mockCancellationsRepository,
                },
            ],
        }).compile();

        service = module.get<AssignmentsService>(AssignmentsService);
        assignmentsRepository = module.get<Repository<Assignment>>(getRepositoryToken(Assignment));
        cancellationsRepository = module.get<Repository<ShiftCancellation>>(getRepositoryToken(ShiftCancellation));

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new assignment', async () => {
            const createAssignmentInput: CreateAssignmentInput = {
                userId: 'user-1',
                shiftId: 'shift-1',
            };

            mockAssignmentsRepository.create.mockReturnValue(mockAssignment);
            mockAssignmentsRepository.save.mockResolvedValue(mockAssignment);
            mockAssignmentsRepository.findOne.mockResolvedValue(mockAssignment);

            const result = await service.create(createAssignmentInput);

            expect(result).toEqual(mockAssignment);
            expect(mockAssignmentsRepository.create).toHaveBeenCalledWith(createAssignmentInput);
            expect(mockAssignmentsRepository.save).toHaveBeenCalled();
            expect(mockAssignmentsRepository.findOne).toHaveBeenCalledWith({
                where: { id: mockAssignment.id },
                relations: ['user', 'shift'],
            });
        });

        it('should throw error if assignment creation fails', async () => {
            const createAssignmentInput: CreateAssignmentInput = {
                userId: 'user-1',
                shiftId: 'shift-1',
            };

            mockAssignmentsRepository.create.mockReturnValue(mockAssignment);
            mockAssignmentsRepository.save.mockResolvedValue(mockAssignment);
            mockAssignmentsRepository.findOne.mockResolvedValue(null);

            await expect(service.create(createAssignmentInput)).rejects.toThrow('Failed to create assignment');
        });
    });

    describe('findAll', () => {
        it('should return all assignments for admin user', async () => {
            const paginationArgs: PaginationArgs = { limit: 10, page: 0 };
            const filter: AssignmentFilterInput = {};

            const mockQueryBuilder = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
            } as unknown as SelectQueryBuilder<Assignment>;

            mockAssignmentsRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            const result = await service.findAll(paginationArgs, filter, mockAdminUser);

            expect(mockAssignmentsRepository.createQueryBuilder).toHaveBeenCalledWith('assignment');
            expect(mockQueryBuilder.andWhere).not.toHaveBeenCalledWith(
                'assignment.userId = :currentUserId',
                expect.anything()
            );
            expect(result).toHaveProperty('items');
            expect(result).toHaveProperty('total');
        });

        it('should return only user assignments for non-admin user', async () => {
            const paginationArgs: PaginationArgs = { limit: 10, page: 0 };
            const filter: AssignmentFilterInput = {};

            const mockQueryBuilder = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
            } as unknown as SelectQueryBuilder<Assignment>;

            mockAssignmentsRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            await service.findAll(paginationArgs, filter, mockUser);

            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('assignment.userId = :currentUserId', {
                currentUserId: mockUser.id,
            });
        });

        it('should filter assignments by userId', async () => {
            const paginationArgs: PaginationArgs = { limit: 10, page: 0 };
            const filter: AssignmentFilterInput = { userId: 'user-2' };

            const mockQueryBuilder = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
            } as unknown as SelectQueryBuilder<Assignment>;

            mockAssignmentsRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            await service.findAll(paginationArgs, filter, mockAdminUser);

            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('assignment.userId = :userId', { userId: 'user-2' });
        });

        it('should filter assignments by date range', async () => {
            const paginationArgs: PaginationArgs = { limit: 10, page: 0 };
            const filter: AssignmentFilterInput = {
                startDate: '2025-11-26',
                endDate: '2025-11-30',
            };

            const mockQueryBuilder = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
            } as unknown as SelectQueryBuilder<Assignment>;

            mockAssignmentsRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            await service.findAll(paginationArgs, filter, mockAdminUser);

            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('shift.startTime >= :startDate', {
                startDate: '2025-11-26',
            });
            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('shift.startTime <= :endDate', {
                endDate: '2025-11-30',
            });
        });
    });

    describe('findOne', () => {
        it('should return assignment for admin user', async () => {
            mockAssignmentsRepository.findOne.mockResolvedValue(mockAssignment);

            const result = await service.findOne('assignment-1', mockAdminUser);

            expect(result).toEqual(mockAssignment);
            expect(mockAssignmentsRepository.findOne).toHaveBeenCalledWith({
                where: { id: 'assignment-1' },
                relations: ['user', 'shift'],
            });
        });

        it('should return assignment for owner user', async () => {
            mockAssignmentsRepository.findOne.mockResolvedValue(mockAssignment);

            const result = await service.findOne('assignment-1', mockUser);

            expect(result).toEqual(mockAssignment);
        });

        it('should throw NotFoundException if assignment not found', async () => {
            mockAssignmentsRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne('assignment-999', mockUser)).rejects.toThrow(NotFoundException);
        });

        it('should throw ForbiddenException if non-admin tries to view other user assignment', async () => {
            const otherUserAssignment = { ...mockAssignment, userId: 'user-2' };
            mockAssignmentsRepository.findOne.mockResolvedValue(otherUserAssignment);

            await expect(service.findOne('assignment-1', mockUser)).rejects.toThrow(ForbiddenException);
            await expect(service.findOne('assignment-1', mockUser)).rejects.toThrow(
                'You can only view your own assignments'
            );
        });
    });

    describe('cancelAssignment', () => {
        const cancelInput: CancelAssignmentInput = {
            assignmentId: 'assignment-1',
            reason: 'Personal emergency',
        };

        it('should cancel assignment for admin user', async () => {
            mockAssignmentsRepository.findOne.mockResolvedValue(mockAssignment);
            mockCancellationsRepository.save.mockResolvedValue({});
            mockAssignmentsRepository.delete.mockResolvedValue({ affected: 1 });

            const result = await service.cancelAssignment(cancelInput, mockAdminUser);

            expect(result).toBe(true);
            expect(mockCancellationsRepository.save).toHaveBeenCalledWith({
                userId: mockAssignment.userId,
                shiftId: mockAssignment.shiftId,
                reason: cancelInput.reason,
            });
            expect(mockAssignmentsRepository.delete).toHaveBeenCalledWith(cancelInput.assignmentId);
        });

        it('should cancel assignment for owner user', async () => {
            mockAssignmentsRepository.findOne.mockResolvedValue(mockAssignment);
            mockCancellationsRepository.save.mockResolvedValue({});
            mockAssignmentsRepository.delete.mockResolvedValue({ affected: 1 });

            const result = await service.cancelAssignment(cancelInput, mockUser);

            expect(result).toBe(true);
            expect(mockCancellationsRepository.save).toHaveBeenCalled();
            expect(mockAssignmentsRepository.delete).toHaveBeenCalled();
        });

        it('should throw NotFoundException if assignment not found', async () => {
            mockAssignmentsRepository.findOne.mockResolvedValue(null);

            await expect(service.cancelAssignment(cancelInput, mockUser)).rejects.toThrow(NotFoundException);
        });

        it('should throw ForbiddenException if non-admin tries to cancel other user assignment', async () => {
            const otherUserAssignment = { ...mockAssignment, userId: 'user-2' };
            mockAssignmentsRepository.findOne.mockResolvedValue(otherUserAssignment);

            await expect(service.cancelAssignment(cancelInput, mockUser)).rejects.toThrow(ForbiddenException);
            await expect(service.cancelAssignment(cancelInput, mockUser)).rejects.toThrow(
                'You can only cancel your own assignments'
            );
        });
    });

    describe('remove', () => {
        it('should delete an assignment', async () => {
            mockAssignmentsRepository.delete.mockResolvedValue({ affected: 1 });

            await service.remove('assignment-1');

            expect(mockAssignmentsRepository.delete).toHaveBeenCalledWith('assignment-1');
        });
    });
});
