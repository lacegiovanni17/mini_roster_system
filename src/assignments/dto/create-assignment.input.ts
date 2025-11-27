import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateAssignmentInput {
    @Field(() => ID)
    userId: string;

    @Field(() => ID)
    shiftId: string;
}
