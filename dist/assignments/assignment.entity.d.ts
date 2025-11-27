import { User } from '../users/user.entity';
import { Shift } from '../shifts/shift.entity';
export declare class Assignment {
    id: string;
    user: User;
    userId: string;
    shift: Shift;
    shiftId: string;
    createdAt: Date;
    updatedAt: Date;
}
