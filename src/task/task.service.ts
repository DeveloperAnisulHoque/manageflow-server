import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
 import { CreateTaskDto } from "./dto/create-task-dto";
import { UpdateTaskDto } from "./dto/update-task-dto";
import { Task } from "./entity/task-entity";
import { SharedUserService } from "@common/service/shared-user.service";

/**
 * Task Service contains all business logic for task operations
 */
@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
          private readonly userService: SharedUserService
      
        
    ) {}

    /**
     * Retrieve all tasks from the database
     * Includes related entities (project, assigned users, creators)
     */
    async getAllTasks() {
        return this.taskRepository.find({
            relations: ['project', 'assignedUsers', 'createdBy', 'updatedBy'],
            order: { createdAt: 'DESC' }
        });
    }

    /**
     * Find a specific task by ID
     * @param id Task ID to find
     * @throws NotFoundException if task doesn't exist
     */
    async getTaskById(id: number) {
        const task = await this.taskRepository.findOne({
            where: { id },
            relations: ['project', 'assignedUsers', 'createdBy', 'updatedBy']
        });

        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        return task;
    }

   /**
 * Create and save a new task
 * @param createTaskDto Task data
 * @param createdBy User ID who created the task
 */
async createTask(createTaskDto: CreateTaskDto, createdBy: number) {
    try {
        const { assignedUserIds, ...taskData } = createTaskDto;
        
        // Create task entity
        const task = this.taskRepository.create({
            ...taskData,
            createdBy: { id: createdBy },
            updatedBy: { id: createdBy }
        });

        // Assign users if provided
        if (assignedUserIds?.length > 0) {
            task.assignedUsers = await this.userService.getUsersByIds(assignedUserIds);
        }

        // Save the task and return the result
        const result = await this.taskRepository.save(task);
        console.log('Created task:', result);
        return result;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error; // Or handle it appropriately
    }
}

    /**
     * Update an existing task
     * @param id Task ID to update
     * @param updateTaskDto Updated task data
     * @param updatedBy User ID who updated the task
     * @throws NotFoundException if task doesn't exist
     */
    async updateTask(
        id: number,
        updateTaskDto: UpdateTaskDto,
        updatedBy: number
    ) {
        const { assignedUserIds, ...taskData } = updateTaskDto;
        
        const task = await this.taskRepository.preload({
            id,
            ...taskData,
            updatedBy: { id: updatedBy }
        });

        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        if (assignedUserIds) {
            task.assignedUsers = await this.userService.getUsersByIds(assignedUserIds);
        }

        return this.taskRepository.save(task);
    }

    /**
     * Delete a task from the database
     * @param id Task ID to delete
     * @throws NotFoundException if task doesn't exist
     */
    async deleteTask(id: string) {
        const result = await this.taskRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
    }
}