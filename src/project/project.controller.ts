import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
  Request,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project-dto';
import { UpdateProjectDto } from './dto/update-project-dto';
import { Private } from '@common/decorator/private.decorator';
import { ValidIdPipe } from '@common/pipe/valid-id-pipe';
import { Permission } from '@role/enum/permission.enum';
import { Permissions } from '@role/decorator/permissions.decorator';
import { CheckOwnership } from '@role/decorator/check-ownership-decorator';

/**
 * ProjectController handles all HTTP requests related to project management
 * including CRUD operations and user assignments.
 * All endpoints require authentication (@Private) and specific permissions.
 */
@Controller('projects')
@Private()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  /**
   * Retrieves all projects (requires ViewProjects permission)
   * @returns All projects with success message
   */
  @Get()
  @Permissions(Permission.ViewProjects)
  async getAllProjects() {
    const projects = await this.projectService.getProjects();
    return {
      message: 'Projects retrieved successfully',
      data: projects,
    };
  }

  /**
   * Retrieves a specific project by ID
   * @param id Project ID (validated by ValidIdPipe)
   * @returns Requested project with success message
   */
  @Get(':id')
  @Permissions(Permission.ViewProject)
  @CheckOwnership('project', 'id')
  async getProjectById(@Param('id', ValidIdPipe) id: number) {
    const project = await this.projectService.getProjectById(id);
    return {
      message: 'Project retrieved successfully',
      data: project,
    };
  }

  /**
   * Creates a new project (requires CreateProject permission)
   * @param createProjectDto Project creation data
   * @param req Request object containing user ID
   * @returns Success message
   */
  @Post()
  @Permissions(Permission.CreateProject)
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @Request() req: any,
  ) {
    return await this.projectService.createProject(createProjectDto, req.user?.id);
  }

  /**
   * Updates an existing project (requires UpdateProject permission)
   * @param id Project ID (validated by ValidIdPipe)
   * @param updateProjectDto Project update data
   * @returns Success message
   */
  @Patch(':id')
  @Permissions(Permission.UpdateProject)
  async updateProject(
    @Param('id', ValidIdPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return await this.projectService.updateProject(id, updateProjectDto);
  }

  /**
   * Deletes a project (requires RemoveProject permission)
   * @param id Project ID (validated by ValidIdPipe)
   * @returns Success message
   */
  @Delete(':id')
  @Permissions(Permission.RemoveProject)
  async deleteProject(@Param('id', ValidIdPipe) id: number) {
    return await this.projectService.deleteProject(id);
  }

  /**
   * Assigns users to a project (requires UpdateProject permission)
   * @param projectId Project ID (validated by ValidIdPipe)
   * @param userIds Array of user IDs to assign
   * @returns Updated project with success message
   */
  @Patch(':id/assign')
  @Permissions(Permission.UpdateProject)
  async assignUserToProject(
    @Param('id', ValidIdPipe) projectId: number,
    @Body('assignedUsers') userIds: number[],
  ) {
    const result = await this.projectService.assignUsersToProject(projectId, userIds);
    return {
      message: 'Users assigned to project successfully',
      data: result,
    };
  }
}