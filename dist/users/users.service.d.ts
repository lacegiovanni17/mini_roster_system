import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { PaginationArgs } from '../common/pagination/pagination.args';
import { UserFilterInput } from './dto/user-filter.input';
import { IPaginatedType } from '../common/pagination/paginated.result';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserInput: CreateUserInput): Promise<User>;
    findAll(paginationArgs: PaginationArgs, filter: UserFilterInput): Promise<IPaginatedType<User>>;
    findOne(id: string): Promise<User | null>;
    remove(id: string): Promise<void>;
}
