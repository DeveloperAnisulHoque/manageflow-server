import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entity/project-entity';
import { CreateProjectDto } from './dto/create-project-dto';
import { UpdateProjectDto } from './dto/update-project-dto';
import { PROJECT_MESSAGES } from '@common/messages';
import { SharedUserService } from '@common/service/shared-user.service';

/**
 * ProjectService handles all business logic related to project management
 * including CRUD operations, user assignments, and project relationships.
 */
@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly userService: SharedUserService
  ) {}

  /**
   * Configuration for project entity relations and field selection
   * Optimizes queries by loading only necessary user data
   */
  private projectRelationOptions = {
    relations: ["assignedUsers", "createdBy", "updatedBy", "tasks"],
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
   * Retrieves all projects with their related entities
   * @returns Promise<Project[]> - Array of projects with populated relations
   */
  async getProjects(): Promise<Project[]> {
    return this.projectRepository.find(this.projectRelationOptions);
  }

  /**
   * Finds a single project by ID with all related entities
   * @param projectId - ID of the project to retrieve
   * @returns Promise<Project> - The requested project
   * @throws NotFoundException if project doesn't exist
   */
  async getProjectById(projectId: number): Promise<Project> {
    try {
      return await this.projectRepository.findOneOrFail({
        where: { id: projectId },
        ...this.projectRelationOptions
      });
    } catch {
      throw new NotFoundException(PROJECT_MESSAGES.NOT_FOUND(projectId));
    }
  }

  /**
   * Creates a new project and assigns the creator as the first team member
   * @param createProjectDto - Data for the new project
   * @param currentUserId - ID of the user creating the project
   * @returns Promise<{ message: string }> - Success message
   * @throws BadRequestException for invalid data or user
   */
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

    const newProject = this.projectRepository.create({
      ...createProjectDto,
      createdBy: user,
      assignedUsers: [user], // Automatically assign creator to project
    });

    const savedProject = await this.projectRepository.save(newProject);

    if (savedProject) {
      return { message: PROJECT_MESSAGES.CREATE_SUCCESS };
    }

    throw new BadRequestException(PROJECT_MESSAGES.CREATE_FAILED);
  }

  /**
   * Updates an existing project's properties
   * @param projectId - ID of the project to update
   * @param updateProjectDto - Data to update
   * @returns Promise<{ message: string }> - Success message
   * @throws NotFoundException if project doesn't exist
   */
  async updateProject(
    projectId: number,
    updateProjectDto: UpdateProjectDto
  ): Promise<{ message: string }> {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });

    if (!project) {
      throw new NotFoundException(PROJECT_MESSAGES.NOT_FOUND(projectId));
    }

    await this.projectRepository.update(projectId, updateProjectDto);
    return { message: PROJECT_MESSAGES.UPDATE_SUCCESS };
  }

  /**
   * Deletes a project permanently
   * @param projectId - ID of the project to delete
   * @returns Promise<{ message: string }> - Success message
   * @throws NotFoundException if project doesn't exist
   */
  async deleteProject(projectId: number): Promise<{ message: string }> {
    const result = await this.projectRepository.delete(projectId);

    if (result.affected === 0) {
      throw new NotFoundException(PROJECT_MESSAGES.NOT_FOUND(projectId));
    }

    return { message: PROJECT_MESSAGES.DELETE_SUCCESS };
  }

  /**
   * Assigns users to a project while preventing duplicates
   * @param projectId - ID of the project to assign users to
   * @param userIds - Array of user IDs to assign
   * @returns Promise<Project> - Updated project with assigned users
   * @throws NotFoundException if project doesn't exist
   * @throws BadRequestException if no valid users found
   */
  async assignUsersToProject(
    projectId: number,
    userIds: number[]
  ): Promise<Project> {
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

    // Use Set to ensure unique users only
    project.assignedUsers = Array.from(
      new Set([...project.assignedUsers, ...users])
    );

    return await this.projectRepository.save(project);
  }
}