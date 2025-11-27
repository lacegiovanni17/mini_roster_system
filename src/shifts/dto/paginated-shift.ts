import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../common/pagination/paginated.result';
import { Shift } from '../shift.entity';

@ObjectType()
export class PaginatedShift extends Paginated(Shift) { }
