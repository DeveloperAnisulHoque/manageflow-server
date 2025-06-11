import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from "@nestjs/common";
import { TaskService } from "./task.service";
import { Private } from "@common/decorator/private.decorator";
import { Permissions } from "@role/decorator/permissions.decorator";
import { Permission } from "@role/enum/permission.enum";
import { CreateTaskDto } from "./dto/create-task-dto";
import { UpdateTaskDto } from "./dto/update-task-dto";
import { ValidIdPipe } from "@common/pipe/valid-id-pipe";

/**
 * Task Controller handles all HTTP requests related to tasks
 * All endpoints require authentication (@Private decorator)
 */
@Controller('tasks')
@Private()
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    /**
     * Fetch a single task by ID
     * Requires ViewTask permission
     * @param id Task ID to retrieve
     */
    @Get(':id')
    @Permissions(Permission.ViewTask)
    async getTask(@Param('id',ValidIdPipe) id: number) {
        return this.taskService.getTaskById(id);
    }

    /**
     * Fetch all tasks in the system
     * Requires ViewTasks permission
     */
    @Get('')
    @Permissions(Permission.ViewTasks)
    async getAllTasks() {
        return this.taskService.getAllTasks();
    }

    /**
     * Create a new task
     * Requires CreateTask permission
     * @param createTaskDto Task data to create
     * @param req Request object containing user info
     */
    @Post('')
    @Permissions(Permission.CreateTask)
    async createTask(
        @Body() createTaskDto: CreateTaskDto,
        @Req() req: any
    ) {
        const createdBy = req.user.id;
        return await this.taskService.createTask(createTaskDto, createdBy);
    }

    /**
     * Update an existing task
     * Requires UpdateTask permission
     * @param id Task ID to update
     * @param updateTaskDto Updated task data
     * @param req Request object containing user info
     */
    @Patch(':id')
    @Permissions(Permission.UpdateTask)
    async updateTask(
        @Param('id',ValidIdPipe) id: number,
        @Body() updateTaskDto: UpdateTaskDto,
        @Req() req: any
    ) {
        const updatedBy = req.user.id;
        return this.taskService.updateTask(id, updateTaskDto, updatedBy);
    }

    /**
     * Delete a task
     * Requires RemoveTask permission
     * @param id Task ID to delete
     */
    @Delete(':id')
    @Permissions(Permission.RemoveTask)
    async deleteTask(@Param('id') id: string) {
        return this.taskService.deleteTask(id);
    }
}