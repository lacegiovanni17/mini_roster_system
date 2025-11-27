import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class AssignmentFilterInput {
    @Field(() => ID, { nullable: true })
    userId?: string;

    @Field(() => ID, { nullable: true })
    shiftId?: string;

    @Field({ nullable: true })
    date?: string; // Filter assignments by a specific date (based on shift start time) - Format: YYYY-MM-DD

    @Field({ nullable: true })
    startDate?: string; // Filter assignments from this date onwards - Format: YYYY-MM-DD

    @Field({ nullable: true })
    endDate?: string; // Filter assignments up to this date - Format: YYYY-MM-DD
}
