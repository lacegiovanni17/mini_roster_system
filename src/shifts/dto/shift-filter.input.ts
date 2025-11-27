import { InputType, Field } from '@nestjs/graphql';
import { TimeSlot } from '../enums/time-slot.enum';

@InputType()
export class ShiftFilterInput {
    @Field({ nullable: true })
    isOpen?: boolean;

    @Field({ nullable: true })
    startDate?: string; // Format: YYYY-MM-DD

    @Field({ nullable: true })
    endDate?: string; // Format: YYYY-MM-DD

    @Field(() => String, { nullable: true })
    timeSlot?: TimeSlot;
}
