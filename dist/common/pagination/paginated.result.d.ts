import { Type } from '@nestjs/common';
export interface IPaginatedType<T> {
    items: T[];
    total: number;
}
export declare function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>>;
