import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../users/user.entity';
import { Shift } from '../shifts/shift.entity';

@ObjectType()
@Entity()
export class Assignment {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.assignments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @Field(() => Shift)
    @ManyToOne(() => Shift, (shift) => shift.assignments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'shiftId' })
    shift: Shift;

    @Column()
    shiftId: string;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}
