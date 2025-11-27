import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftsService } from './shifts.service';
import { ShiftsResolver } from './shifts.resolver';
import { Shift } from './shift.entity';
import { Assignment } from '../assignments/assignment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Shift, Assignment])],
    providers: [ShiftsService, ShiftsResolver],
    exports: [ShiftsService],
})
export class ShiftsModule { }
