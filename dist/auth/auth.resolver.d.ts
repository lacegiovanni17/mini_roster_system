import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './dto/auth-response';
import { User } from '../users/user.entity';
export declare class AuthResolver {
    private readonly authService;
    constructor(authService: AuthService);
    register(input: RegisterInput): Promise<AuthResponse>;
    login(input: LoginInput): Promise<AuthResponse>;
    me(user: User): User;
}
