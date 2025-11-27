import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../users/user.entity';
import { Shift } from '../shifts/shift.entity';

@Entity()
@ObjectType()
export class ShiftCancellation {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @Column()
    @Field()
    userId: string;

    @ManyToOne(() => User)
    @Field(() => User)
    user: User;

    @Column()
    @Field()
    shiftId: string;

    @ManyToOne(() => Shift)
    @Field(() => Shift)
    shift: Shift;

    @Column()
    @Field()
    reason: string;

    @CreateDateColumn()
    @Field()
    cancelledAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}
