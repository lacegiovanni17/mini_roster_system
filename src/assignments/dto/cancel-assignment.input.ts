import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CancelAssignmentInput {
    @Field(() => ID)
    assignmentId: string;

    @Field()
    reason: string;
}
