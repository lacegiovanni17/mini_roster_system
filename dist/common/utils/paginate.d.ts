import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { PaginationArgs } from '../pagination/pagination.args';
import { IPaginatedType } from '../pagination/paginated.result';
export declare function paginate<T extends ObjectLiteral>(queryBuilder: SelectQueryBuilder<T>, paginationArgs: PaginationArgs): Promise<IPaginatedType<T>>;
