"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = paginate;
async function paginate(queryBuilder, paginationArgs) {
    const { page, limit } = paginationArgs;
    const skip = (page - 1) * limit;
    const take = limit;
    const [items, total] = await queryBuilder
        .skip(skip)
        .take(take)
        .getManyAndCount();
    return { items, total };
}
//# sourceMappingURL=paginate.js.map