import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "@project/entity/project-entity";
import { Repository } from "typeorm";
 

@Injectable()
export class OwnershipService {
 constructor(@InjectRepository(Project) private readonly projectRepository:Repository<Project>){}
async ownsProject(projectId: number, userId: number) {
  return this.projectRepository
    .createQueryBuilder("project")
    .innerJoin("project.createdBy", "user")
    .where("project.id = :projectId", { projectId })
    .andWhere("user.id = :userId", { userId })
    .getOne();
}

}