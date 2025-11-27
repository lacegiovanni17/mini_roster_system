import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { PaginationArgs } from '../pagination/pagination.args';
import { IPaginatedType } from '../pagination/paginated.result';

export async function paginate<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationArgs: PaginationArgs,
): Promise<IPaginatedType<T>> {
    const { page, limit } = paginationArgs;

    // Convert page/limit to skip/take
    const skip = (page - 1) * limit;
    const take = limit;

    const [items, total] = await queryBuilder
        .skip(skip)
        .take(take)
        .getManyAndCount();

    return { items, total };
}
