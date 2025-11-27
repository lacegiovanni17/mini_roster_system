import { InputType, Field } from '@nestjs/graphql';
import { TimeSlot } from '../enums/time-slot.enum';

@InputType()
export class CreateShiftInput {
    @Field()
    date: string; // Format: YYYY-MM-DD

    @Field(() => String)
    timeSlot: TimeSlot;

    @Field({ defaultValue: true })
    isOpen: boolean;
}
