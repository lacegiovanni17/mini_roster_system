import { TimeSlot } from '../enums/time-slot.enum';
export declare class RepeatShiftInput {
    userId?: string;
    startDate: string;
    endDate: string;
    timeSlot: TimeSlot;
    daysOfWeek?: number[];
    isOpen: boolean;
}
