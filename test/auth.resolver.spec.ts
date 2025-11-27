import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from '../src/auth/auth.resolver';
import { AuthService } from '../src/auth/auth.service';

describe('AuthResolver', () => {
    let resolver: AuthResolver;
    let authService: AuthService;

    const mockAuthService = {
        register: jest.fn(),
        login: jest.fn(),
        validateUser: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthResolver,
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        resolver = module.get<AuthResolver>(AuthResolver);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
