import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { CreateUserInput } from "./dto/create-user.input";
import { PaginationArgs } from "../common/pagination/pagination.args";
import { UserFilterInput } from "./dto/user-filter.input";
export declare class UsersResolver {
    private readonly usersService;
    constructor(usersService: UsersService);
    createUser(createUserInput: CreateUserInput): Promise<User>;
    findAll(paginationArgs: PaginationArgs, filter?: UserFilterInput): Promise<import("../common/pagination/paginated.result").IPaginatedType<User>>;
    findOne(id: string): Promise<User | null>;
    removeUser(id: string): Promise<boolean>;
}
