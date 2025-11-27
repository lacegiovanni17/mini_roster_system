import { Assignment } from '../assignments/assignment.entity';
export declare class User {
    id: string;
    name: string;
    email: string;
    role: string;
    password?: string;
    assignments: Assignment[];
    createdAt: Date;
    updatedAt: Date;
}
