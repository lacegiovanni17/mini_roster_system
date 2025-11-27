import { Assignment } from '../assignments/assignment.entity';
import { TimeSlot } from './enums/time-slot.enum';
export declare class Shift {
    id: string;
    startTime: Date;
    endTime: Date;
    timeSlot: TimeSlot;
    isOpen: boolean;
    assignments: Assignment[];
    createdAt: Date;
    updatedAt: Date;
}
