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

@Controller('projects')
@Private()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) { }

  // GET /projects
  @Get()
  async getAllProjects() {
    const projects = await this.projectService.getProjects();
    return {
      message: 'Projects retrieved successfully.',
      data: projects,
    };
  }

  // GET /projects/:id
  @Get(':id')
  async getProjectById(@Param('id', ValidIdPipe) id: number) {
    const project = await this.projectService.getProjectById(id);
    return {
      message: 'Project retrieved successfully.',
      data: project,
    };
  }

  // POST /projects
  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto, @Request() req: any) {

    return await this.projectService.createProject(createProjectDto, req.user?.id);
  }

  // PUT /projects/:id
  @Patch(':id')
  async updateProject(
    @Param('id', ValidIdPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return await this.projectService.updateProject(id, updateProjectDto);
  }

  // DELETE /projects/:id
  @Delete(':id')
  async deleteProject(@Param('id', ValidIdPipe) id: number) {
    return await this.projectService.deleteProject(id);
  }

  // PATCH /projects/:id/assign
  @Patch(':id/assign')
  async assignUserToProject(
    @Param('id', ValidIdPipe) projectId: number,
    @Body('assignedUsers') userIds: number[],
  ) {
    const result = await this.projectService.assignUsersToProject(projectId, userIds);
    return {
      message: 'Users assigned to project successfully.',
      data: result,
    };
  }

}
