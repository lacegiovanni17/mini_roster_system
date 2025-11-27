import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Assignment } from '../assignments/assignment.entity';
import { TimeSlot } from './enums/time-slot.enum';

@ObjectType()
@Entity()
export class Shift {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column({ type: 'timestamp' })
    startTime: Date;

    @Field()
    @Column({ type: 'timestamp' })
    endTime: Date;

    @Field(() => String)
    @Column({ type: 'enum', enum: TimeSlot })
    timeSlot: TimeSlot;

    @Field()
    @Column({ default: true })
    isOpen: boolean;

    @OneToMany(() => Assignment, (assignment) => assignment.shift)
    @Field(() => [Assignment], { nullable: true })
    assignments: Assignment[];

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}
