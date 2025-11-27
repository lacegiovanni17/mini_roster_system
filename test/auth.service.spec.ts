import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../src/auth/auth.service';
import { User } from '../src/users/user.entity';
import { RegisterInput } from '../src/auth/dto/register.input';
import { LoginInput } from '../src/auth/dto/login.input';

// Mock bcrypt
const mockHash = jest.fn();
const mockCompare = jest.fn();
jest.mock('bcrypt', () => ({
    hash: (...args: any[]) => mockHash(...args),
    compare: (...args: any[]) => mockCompare(...args),
}));

// Mock the utils module
jest.mock('../src/common/utils', () => ({
    generateToken: jest.fn((user) => `mock-token-${user.id}`),
}));

describe('AuthService', () => {
    let service: AuthService;
    let usersRepository: Repository<User>;
    let jwtService: JwtService;

    const mockUser: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword123',
        role: 'user',
        assignments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockUsersRepository = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        createQueryBuilder: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUsersRepository,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
        jwtService = module.get<JwtService>(JwtService);

        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('register', () => {
        const registerInput: RegisterInput = {
            name: 'New User',
            email: 'newuser@example.com',
            password: 'password123',
            role: 'user',
        };

        beforeEach(() => {
            // Mock bcrypt.hash before each test
            mockHash.mockResolvedValue('hashedPassword');
        });

        it('should successfully register a new user', async () => {
            mockUsersRepository.findOne.mockResolvedValue(null);
            mockUsersRepository.create.mockReturnValue({ ...mockUser, ...registerInput });
            mockUsersRepository.save.mockResolvedValue({ ...mockUser, id: '2', ...registerInput });

            const result = await service.register(registerInput);

            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('user');
            expect(result.accessToken).toBe('mock-token-2');
            expect(mockUsersRepository.findOne).toHaveBeenCalledWith({ where: { email: registerInput.email } });
            expect(mockHash).toHaveBeenCalledWith(registerInput.password, 10);
            expect(mockUsersRepository.save).toHaveBeenCalled();
        });

        it('should throw error if user already exists', async () => {
            mockUsersRepository.findOne.mockResolvedValue(mockUser);

            await expect(service.register(registerInput)).rejects.toThrow('User with this email already exists');
            expect(mockUsersRepository.save).not.toHaveBeenCalled();
        });
    });

    describe('login', () => {
        const loginInput: LoginInput = {
            email: 'test@example.com',
            password: 'password123',
        };

        it('should successfully login with valid credentials', async () => {
            const mockQueryBuilder = {
                where: jest.fn().mockReturnThis(),
                addSelect: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue(mockUser),
            };

            mockUsersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
            mockCompare.mockResolvedValue(true);

            const result = await service.login(loginInput);

            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('user');
            expect(result.accessToken).toBe('mock-token-1');
            expect(result.user).not.toHaveProperty('password');
            expect(mockCompare).toHaveBeenCalledWith(loginInput.password, mockUser.password);
        });

        it('should throw UnauthorizedException if user not found', async () => {
            const mockQueryBuilder = {
                where: jest.fn().mockReturnThis(),
                addSelect: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue(null),
            };

            mockUsersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

            await expect(service.login(loginInput)).rejects.toThrow(UnauthorizedException);
            await expect(service.login(loginInput)).rejects.toThrow('Invalid credentials');
        });

        it('should throw UnauthorizedException if password is invalid', async () => {
            const mockQueryBuilder = {
                where: jest.fn().mockReturnThis(),
                addSelect: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue(mockUser),
            };

            mockUsersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
            mockCompare.mockResolvedValue(false);

            await expect(service.login(loginInput)).rejects.toThrow(UnauthorizedException);
            await expect(service.login(loginInput)).rejects.toThrow('Invalid credentials');
        });
    });

    describe('validateUser', () => {
        it('should return user if found', async () => {
            mockUsersRepository.findOne.mockResolvedValue(mockUser);

            const result = await service.validateUser('1');

            expect(result).toEqual(mockUser);
            expect(mockUsersRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
        });

        it('should return null if user not found', async () => {
            mockUsersRepository.findOne.mockResolvedValue(null);

            const result = await service.validateUser('999');

            expect(result).toBeNull();
        });
    });
});
