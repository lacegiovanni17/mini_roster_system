import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { CreateUserInput } from "./dto/create-user.input";
import { PaginationArgs } from "../common/pagination/pagination.args";
import { UserFilterInput } from "./dto/user-filter.input";
import { PaginatedUser } from "./dto/paginated-user";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args("createUserInput") createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => PaginatedUser, { name: "users" })
  findAll(
    @Args() paginationArgs: PaginationArgs,
    @Args("filter", { nullable: true }) filter: UserFilterInput = {},
  ) {
    return this.usersService.findAll(paginationArgs, filter);
  }

  @Query(() => User, { name: "user" })
  findOne(@Args("id", { type: () => ID }) id: string) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => Boolean)
  async removeUser(@Args("id", { type: () => ID }) id: string) {
    await this.usersService.remove(id);
    return true;
  }
}
