import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../common/pagination/paginated.result';
import { User } from '../user.entity';

@ObjectType()
export class PaginatedUser extends Paginated(User) { }
