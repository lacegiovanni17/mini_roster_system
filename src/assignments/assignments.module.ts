import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentsService } from './assignments.service';
import { AssignmentsResolver } from './assignments.resolver';
import { Assignment } from './assignment.entity';
import { ShiftCancellation } from './shift-cancellation.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Assignment, ShiftCancellation])],
    providers: [AssignmentsResolver, AssignmentsService],
    exports: [AssignmentsService],
})
export class AssignmentsModule { }
