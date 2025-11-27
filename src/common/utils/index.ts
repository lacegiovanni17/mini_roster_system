import { User } from "../../users/user.entity";
import { JwtService } from '@nestjs/jwt';


export function generateToken(user: User, jwtService: JwtService): string {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return jwtService.sign(payload);
}