import { User } from "../../users/user.entity";
import { JwtService } from '@nestjs/jwt';
export declare function generateToken(user: User, jwtService: JwtService): string;
