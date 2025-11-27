import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './dto/auth-response';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    register(registerInput: RegisterInput): Promise<AuthResponse>;
    login(loginInput: LoginInput): Promise<AuthResponse>;
    validateUser(userId: string): Promise<User | null>;
}
