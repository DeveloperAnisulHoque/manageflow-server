import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entity/task-entity';
import { TaskService } from './task.service';
 
@Module({
    imports:[TypeOrmModule.forFeature([Task])],
    controllers:[TaskController],
    providers:[TaskService]
})
export class TaskModule {

}
