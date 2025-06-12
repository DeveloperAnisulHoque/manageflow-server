import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "@project/entity/project-entity";
import { Repository } from "typeorm";

/**
 * Service for handling ownership verification of projects
 * Provides methods to check if users have ownership rights over specific resources
 */
@Injectable()
export class OwnershipService {
    constructor(
        @InjectRepository(Project) 
        private readonly projectRepository: Repository<Project>
    ) {}

    /**
     * Verifies if a user owns a specific project
     * @param projectId - The ID of the project to verify ownership for
     * @param userId - The ID of the user to check ownership against
     * @returns Promise<Project | undefined> - The project if owned by user, undefined otherwise
     * 
     * @example
     * const isOwner = await ownershipService.ownsProject(123, 456);
     * if (!isOwner) throw new ForbiddenException();
     */
    async ownsProject(projectId: number, userId: number) {
        return this.projectRepository
            .createQueryBuilder("project")
            .innerJoin("project.createdBy", "user")  // Join with the creator relation
            .where("project.id = :projectId", { projectId })  // Filter by project ID
            .andWhere("user.id = :userId", { userId })  // Filter by user ID
            .getOne();  // Get the first matching result
    }
}