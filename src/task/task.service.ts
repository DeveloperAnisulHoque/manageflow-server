import { Injectable, NotFoundException, Logger, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task-dto";
import { UpdateTaskDto } from "./dto/update-task-dto";
import { Task } from "./entity/task-entity";
import { SharedUserService } from "@common/service/shared-user.service";
import { RedisService } from "src/redis/redis.service";

/**
 * Task Service handles all business logic for task operations
 * Includes caching with Redis for improved performance
 */
@Injectable()
export class TaskService {
    private readonly logger = new Logger(TaskService.name);
    private readonly TASK_CACHE_TTL = 300; // 5 minutes in seconds

    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
        private readonly userService: SharedUserService,
        private readonly redisService: RedisService,
    ) { }

    /**
     * Configuration for task entity relations and field selection
     * Optimizes queries by loading only necessary user data
     */
    private readonly taskRelationOptions = {
        relations: ["assignedUsers", "createdBy", "updatedBy", "project"],
        select: {
            assignedUsers: {
                id: true,
                name: true,
                email: true,
                profilePicture: true
            },
            createdBy: {
                id: true,
                name: true,
                email: true,
                profilePicture: true
            },
            updatedBy: {
                id: true,
                name: true,
                email: true,
                profilePicture: true
            },
        }
    }

    /**
     * Retrieve all tasks from the database with caching support
     * @returns Promise<Task[]> Array of all tasks
     */
    async getAllTasks(): Promise<Task[]> {
        const cacheKey = 'tasks:all';

        try {
            // Try to get from cache first
            const cachedTasks = await this.redisService.get<Task[]>(cacheKey);
            if (cachedTasks) {
                this.logger.debug('Retrieved all tasks from cache');
                return cachedTasks;
            }
        } catch (error) {
            this.logger.error(`Failed to get tasks from cache: ${error.message}`, error.stack);
        }

        try {
            // Fetch from database if not in cache
            const tasks = await this.taskRepository.find({
                ...this.taskRelationOptions,
                order: { createdAt: 'DESC' }
            });

            // Cache the result
            try {
                await this.redisService.set(cacheKey, tasks, this.TASK_CACHE_TTL);
                this.logger.debug('Cached all tasks');
            } catch (error) {
                this.logger.error(`Failed to cache tasks: ${error.message}`, error.stack);
            }

            return tasks;
        } catch (error) {
            this.logger.error(`Failed to fetch tasks from database: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to retrieve tasks');
        }
    }

    /**
     * Find a specific task by ID with caching
     * @param id Task ID to find
     * @returns Promise<Task> The requested task
     * @throws NotFoundException if task doesn't exist
     */
    async getTaskById(id: number): Promise<Task> {
        const cacheKey = `task:${id}`;

        // Try to get from cache first
        try {
            const cachedTask = await this.redisService.get<Task>(cacheKey);
            if (cachedTask) {
                this.logger.debug(`Cache hit for task ${id}`);
                return cachedTask;
            }
        } catch (error) {
            this.logger.error(`Redis get error for key ${cacheKey}: ${error.message}`, error.stack);
        }

        try {
            // Fetch from database if not in cache
            const task = await this.taskRepository.findOne({
                where: { id },
                ...this.taskRelationOptions,
            });

            if (!task) {
                this.logger.warn(`Task with ID ${id} not found`);
                throw new NotFoundException(`Task with ID ${id} not found`);
            }

            // Cache the task
            try {
                await this.redisService.set(cacheKey, task, this.TASK_CACHE_TTL);
                this.logger.debug(`Cached task ${id}`);
            } catch (error) {
                this.logger.error(`Failed to cache task ${id}: ${error.message}`, error.stack);
            }

            return task;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            this.logger.error(`Failed to fetch task ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to retrieve task');
        }
    }

    /**
     * Create and save a new task with cache invalidation
     * @param createTaskDto Task data
     * @param createdBy User ID who created the task
     * @returns Promise<Task> The created task
     */
    async createTask(createTaskDto: CreateTaskDto, createdBy: number): Promise<Task> {
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

            // Save the task
            const result = await this.taskRepository.save(task);

            // Invalidate the all-tasks cache
            try {
                await this.redisService.delete('tasks:all');
                this.logger.debug('Invalidated tasks:all cache after creation');
            } catch (error) {
                this.logger.error(`Failed to invalidate cache: ${error.message}`, error.stack);
            }

            return result;
        } catch (error) {
            this.logger.error(`Failed to create task: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to create task');
        }
    }

    /**
     * Update an existing task with cache invalidation
     * @param id Task ID to update
     * @param updateTaskDto Updated task data
     * @param updatedBy User ID who updated the task
     * @returns Promise<Task> The updated task
     * @throws NotFoundException if task doesn't exist
     */
    async updateTask(
        id: number,
        updateTaskDto: UpdateTaskDto,
        updatedBy: number
    ): Promise<Task> {
        try {
            const { assignedUserIds, ...taskData } = updateTaskDto;

            const existingTask = await this.getTaskById(id);
            if (!existingTask) {
                throw new NotFoundException(`Task with ID ${id} not found`);
            }

            const task = await this.taskRepository.preload({
                id,
                ...taskData,
                updatedBy: { id: updatedBy }
            });

            if (!task) {
                throw new NotFoundException(`Task with ID ${id} not found during preload`);
            }

            if (assignedUserIds) {
                task.assignedUsers = await this.userService.getUsersByIds(assignedUserIds);
            }

            const updatedTask = await this.taskRepository.save(task);

            try {
                await Promise.all([
                    this.redisService.delete(`task:${id}`),
                    this.redisService.delete('tasks:all')
                ]);
                this.logger.debug(`Invalidated caches for task ${id} and all tasks`);
            } catch (cacheError) {
                this.logger.error(`Failed to invalidate caches: ${cacheError.message}`, cacheError.stack);
            }

            return updatedTask;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            this.logger.error(`Failed to update task ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to update task');
        }
    }

    /**
     * Delete a task from the database with cache invalidation
     * @param id Task ID to delete
     * @throws NotFoundException if task doesn't exist
     */
    async deleteTask(id: number): Promise<void> {
        try {
            // Verify task exists (this will also check cache)
            const task = await this.getTaskById(id);

            // Delete the task
            const result = await this.taskRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException(`Task with ID ${id} not found`);
            }

            // Invalidate relevant caches
            try {
                await Promise.all([
                    this.redisService.delete(`task:${id}`),
                    this.redisService.delete('tasks:all')
                ]);
                this.logger.debug(`Invalidated caches for deleted task ${id}`);
            } catch (error) {
                this.logger.error(`Failed to invalidate caches: ${error.message}`, error.stack);
            }
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            this.logger.error(`Failed to delete task ${id}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to delete task');
        }
    }
}