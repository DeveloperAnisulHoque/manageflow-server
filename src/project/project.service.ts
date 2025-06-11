import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entity/project-entity';
import { CreateProjectDto } from './dto/create-project-dto';
import { UpdateProjectDto } from './dto/update-project-dto';
import { PROJECT_MESSAGES } from '@common/messages';
import { SharedUserService } from '@common/service/shared-user.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly userService: SharedUserService
  ) { }


  private projectRelationOptions = {
    relations: ["assignedUsers", "createdBy", "updatedBy","tasks"], select: {
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

  // Get all projects
  async getProjects(): Promise<Project[]> {
    return this.projectRepository.find(this.projectRelationOptions);
  }

  // Get project by ID
  async getProjectById(projectId: number): Promise<Project> {
    try {
      return await this.projectRepository.findOneOrFail({
        where: { id: projectId }, ...this.projectRelationOptions
      });
    } catch {
      throw new NotFoundException(PROJECT_MESSAGES.NOT_FOUND(projectId));
    }
  }

  // Create a new project
  async createProject(
    createProjectDto: CreateProjectDto,
    currentUserId: number,
  ): Promise<{ message: string }> {
    if (!createProjectDto) {
      throw new BadRequestException(PROJECT_MESSAGES.BAD_REQUEST);
    }

    const user = await this.userService.getUserById(currentUserId);
    if (!user) {
      throw new BadRequestException('Invalid user ID.');
    }
    console.log(user);

    const newProject = this.projectRepository.create({
      ...createProjectDto,
      createdBy: user,
      assignedUsers: [user],
    });

    const savedProject = await this.projectRepository.save(newProject);

    if (savedProject) {
      return { message: PROJECT_MESSAGES.CREATE_SUCCESS };
    }

    throw new BadRequestException(PROJECT_MESSAGES.CREATE_FAILED);
  }

  // Update project
  async updateProject(projectId: number, updateProjectDto: UpdateProjectDto): Promise<{ message: string }> {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });

    if (!project) {
      throw new NotFoundException(PROJECT_MESSAGES.NOT_FOUND(projectId));
    }

    await this.projectRepository.update(projectId, updateProjectDto);

    return { message: PROJECT_MESSAGES.UPDATE_SUCCESS };
  }

  // Delete project
  async deleteProject(projectId: number): Promise<{ message: string }> {
    const result = await this.projectRepository.delete(projectId);

    if (result.affected === 0) {
      throw new NotFoundException(PROJECT_MESSAGES.NOT_FOUND(projectId));
    }

    return { message: PROJECT_MESSAGES.DELETE_SUCCESS };
  }

  async assignUsersToProject(projectId: number, userIds: number[]): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['assignedUsers'],
    });

    if (!project) {
      throw new NotFoundException(PROJECT_MESSAGES.NOT_FOUND(projectId));
    }

    const users = await this.userService.getUsersByIds(userIds);
    if (!users.length) {
      throw new BadRequestException('No valid users found to assign.');
    }

    project.assignedUsers = Array.from(new Set([...project.assignedUsers, ...users]));

    return await this.projectRepository.save(project);
  }

}
