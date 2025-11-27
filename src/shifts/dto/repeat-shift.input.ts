import { InputType, Field, Int, ID } from '@nestjs/graphql';
import { TimeSlot } from '../enums/time-slot.enum';

@InputType()
export class RepeatShiftInput {
    @Field(() => ID, { nullable: true })
    userId?: string; // Optional - if provided, automatically assign user to all created shifts

    @Field()
    startDate: string; // Format: YYYY-MM-DD

    @Field()
    endDate: string; // Format: YYYY-MM-DD

    @Field(() => String)
    timeSlot: TimeSlot;

    @Field(() => [Int], { nullable: true })
    daysOfWeek?: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday

    @Field({ defaultValue: true })
    isOpen: boolean;
}
