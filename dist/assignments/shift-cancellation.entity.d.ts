import { User } from '../users/user.entity';
import { Shift } from '../shifts/shift.entity';
export declare class ShiftCancellation {
    id: string;
    userId: string;
    user: User;
    shiftId: string;
    shift: Shift;
    reason: string;
    cancelledAt: Date;
    updatedAt: Date;
}
