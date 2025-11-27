import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../common/pagination/paginated.result';
import { Assignment } from '../assignment.entity';

@ObjectType()
export class PaginatedAssignment extends Paginated(Assignment) { }
