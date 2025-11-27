import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UsersService } from '../src/users/users.service';
import { User } from '../src/users/user.entity';
import { CreateUserInput } from '../src/users/dto/create-user.input';
import { PaginationArgs } from '../src/common/pagination/pagination.args';
import { UserFilterInput } from '../src/users/dto/user-filter.input';

// Mock the paginate utility
jest.mock('../src/common/utils/paginate', () => ({
    paginate: jest.fn((query, paginationArgs) => {
        return Promise.resolve({
            items: [],
            total: 0,
        });
    }),
}));

describe('UsersService', () => {
    let service: UsersService;
    let repository: Repository<User>;

    const mockUser: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
        assignments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockUsersRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        delete: jest.fn(),
        createQueryBuilder: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUsersRepository,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        repository = module.get<Repository<User>>(getRepositoryToken(User));

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const createUserInput: CreateUserInput = {
                name: 'New User',
                email: 'newuser@example.com',
                role: 'user',
            };

            mockUsersRepository.create.mockReturnValue(mockUser);
            mockUsersRepository.save.mockResolvedValue(mockUser);

            const result = await service.create(createUserInput);

            expect(result).toEqual(mockUser);
            expect(mockUsersRepository.create).toHaveBeenCalledWith(createUserInput);
            expect(mockUsersRepository.save).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('findAll', () => {
        it('should return paginated users without filters', async () => {
            const paginationArgs: PaginationArgs = { limit: 10, offset: 0 };
            const filter: UserFilterInput = {};

            const mockQueryBuilder = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
            } as unknown as SelectQueryBuilder<User>;

            mockUsersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            const result = await service.findAll(paginationArgs, filter);

            expect(mockUsersRepository.createQueryBuilder).toHaveBeenCalledWith('user');
            expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('user.assignments', 'assignments');
            expect(result).toHaveProperty('items');
            expect(result).toHaveProperty('total');
        });

        it('should filter users by name', async () => {
            const paginationArgs: PaginationArgs = { limit: 10, offset: 0 };
            const filter: UserFilterInput = { name: 'Test' };

            const mockQueryBuilder = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
            } as unknown as SelectQueryBuilder<User>;

            mockUsersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            await service.findAll(paginationArgs, filter);

            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('user.name ILIKE :name', { name: '%Test%' });
        });

        it('should filter users by email', async () => {
            const paginationArgs: PaginationArgs = { limit: 10, offset: 0 };
            const filter: UserFilterInput = { email: 'test@example.com' };

            const mockQueryBuilder = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
            } as unknown as SelectQueryBuilder<User>;

            mockUsersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            await service.findAll(paginationArgs, filter);

            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('user.email ILIKE :email', { email: '%test@example.com%' });
        });

        it('should filter users by role', async () => {
            const paginationArgs: PaginationArgs = { limit: 10, offset: 0 };
            const filter: UserFilterInput = { role: 'admin' };

            const mockQueryBuilder = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
            } as unknown as SelectQueryBuilder<User>;

            mockUsersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            await service.findAll(paginationArgs, filter);

            expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('user.role = :role', { role: 'admin' });
        });
    });

    describe('findOne', () => {
        it('should return a user by id', async () => {
            mockUsersRepository.findOne.mockResolvedValue(mockUser);

            const result = await service.findOne('1');

            expect(result).toEqual(mockUser);
            expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
                where: { id: '1' },
                relations: ['assignments'],
            });
        });

        it('should return null if user not found', async () => {
            mockUsersRepository.findOne.mockResolvedValue(null);

            const result = await service.findOne('999');

            expect(result).toBeNull();
        });
    });

    describe('remove', () => {
        it('should delete a user', async () => {
            mockUsersRepository.delete.mockResolvedValue({ affected: 1 });

            await service.remove('1');

            expect(mockUsersRepository.delete).toHaveBeenCalledWith('1');
        });
    });
});
