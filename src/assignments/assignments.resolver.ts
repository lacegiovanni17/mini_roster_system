import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { Assignment } from './assignment.entity';
import { CreateAssignmentInput } from './dto/create-assignment.input';
import { CancelAssignmentInput } from './dto/cancel-assignment.input';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { AssignmentFilterInput } from './dto/assignment-filter.input';
import { PaginatedAssignment } from './dto/paginated-assignment';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Resolver(() => Assignment)
@UseGuards(GqlAuthGuard, RolesGuard)
export class AssignmentsResolver {
    constructor(private readonly assignmentsService: AssignmentsService) { }

    @Mutation(() => Assignment)
    @Roles('admin')
    createAssignment(@Args('createAssignmentInput') createAssignmentInput: CreateAssignmentInput) {
        return this.assignmentsService.create(createAssignmentInput);
    }

    @Query(() => PaginatedAssignment, { name: 'assignments' })
    @Roles('admin', 'user')
    findAll(
        @Args() paginationArgs: PaginationArgs,
        @Args('filter', { nullable: true }) filter: AssignmentFilterInput = {},
        @CurrentUser() user: User,
    ) {
        return this.assignmentsService.findAll(paginationArgs, filter, user);
    }

    @Query(() => Assignment, { name: 'assignment' })
    @Roles('admin', 'user')
    findOne(
        @Args('id', { type: () => ID }) id: string,
        @CurrentUser() user: User,
    ) {
        return this.assignmentsService.findOne(id, user);
    }

    @Mutation(() => Boolean)
    @Roles('admin', 'user')
    async cancelAssignment(
        @Args('input') input: CancelAssignmentInput,
        @CurrentUser() user: User,
    ) {
        return this.assignmentsService.cancelAssignment(input, user);
    }

    @Mutation(() => Boolean)
    @Roles('admin')
    async removeAssignment(@Args('id', { type: () => ID }) id: string) {
        await this.assignmentsService.remove(id);
        return true;
    }
}
