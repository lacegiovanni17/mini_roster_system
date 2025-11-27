import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Assignment } from '../assignments/assignment.entity';

@ObjectType()
@Entity()
export class User {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    email: string;

    @Field()
    @Column({ default: 'user' })
    role: string; // 'admin' or 'user'

    @Column({ select: false }) // Don't return password in queries by default
    password?: string;

    @OneToMany(() => Assignment, (assignment) => assignment.user)
    @Field(() => [Assignment], { nullable: true })
    assignments: Assignment[];

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}
