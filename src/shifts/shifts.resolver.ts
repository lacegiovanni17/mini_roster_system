import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { Shift } from './shift.entity';
import { CreateShiftInput } from './dto/create-shift.input';
import { RepeatShiftInput } from './dto/repeat-shift.input';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { ShiftFilterInput } from './dto/shift-filter.input';
import { PaginatedShift } from './dto/paginated-shift';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver(() => Shift)
@UseGuards(GqlAuthGuard, RolesGuard)
export class ShiftsResolver {
    constructor(private readonly shiftsService: ShiftsService) { }

    @Mutation(() => Shift)
    @Roles('admin')
    createShift(@Args('createShiftInput') createShiftInput: CreateShiftInput) {
        return this.shiftsService.create(createShiftInput);
    }

    @Query(() => PaginatedShift, { name: 'shifts' })
    @Roles('admin', 'user')
    findAll(
        @Args() paginationArgs: PaginationArgs,
        @Args('filter', { nullable: true }) filter: ShiftFilterInput = {},
    ) {
        return this.shiftsService.findAll(paginationArgs, filter);
    }

    @Query(() => PaginatedShift, { name: 'openShifts' })
    @Roles('admin', 'user')
    findOpenShifts(@Args() paginationArgs: PaginationArgs) {
        return this.shiftsService.findOpenShifts(paginationArgs);
    }

    @Query(() => Shift, { name: 'shift' })
    @Roles('admin', 'user')
    findOne(@Args('id', { type: () => ID }) id: string) {
        return this.shiftsService.findOne(id);
    }

    @Mutation(() => Boolean)
    @Roles('admin')
    async removeShift(@Args('id', { type: () => ID }) id: string) {
        await this.shiftsService.remove(id);
        return true;
    }

    @Mutation(() => [Shift])
    @Roles('admin')
    repeatShift(@Args('input') input: RepeatShiftInput) {
        return this.shiftsService.repeatShift(input);
    }
}
