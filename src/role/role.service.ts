import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Role } from "./entity/role.entity";
import { CreateRoleDto } from "./dto/create-role-dto";
import { UpdateRoleDto } from "./dto/update-role-dto";

/**
 * RoleService handles all business logic related to role management
 * including creation, updating, deletion, and retrieval of user roles.
 */
@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role) 
        private readonly roleRepository: Repository<Role>
    ) {}

    /**
     * Retrieves all available roles
     * @returns Promise<Role[]> - Array of all role entities
     */
    async getRoles(): Promise<Role[]> {
        return this.roleRepository.find();
    }

    /**
     * Creates a new role after checking for name uniqueness
     * @param createRoleDto - Data for the new role
     * @returns Promise<Role> - The newly created role
     * @throws BadRequestException if role name already exists
     */
    async createRoles(createRoleDto: CreateRoleDto): Promise<Role> {
        const existingRole = await this.roleRepository.findOne({ 
            where: { name: createRoleDto.name } 
        });
        
        if (existingRole) {
            throw new BadRequestException(
                `Role with name ${createRoleDto.name} already exists!`
            );
        }

        const newRole = this.roleRepository.create(createRoleDto);
        return this.roleRepository.save(newRole);
    }

    /**
     * Updates an existing role
     * @param roleId - ID of the role to update
     * @param updateRoleDto - Data to update the role with
     * @returns Promise<Role> - The updated role entity
     * @throws BadRequestException if role doesn't exist
     */
    async updateRoles(roleId: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
        const isRoleExists = await this.roleRepository.exists({ 
            where: { id: roleId } 
        });

        if (!isRoleExists) {
            throw new BadRequestException(
                `Role with id ${roleId} does not exist!`
            );
        }

        const existingRole = await this.roleRepository.findOne({ 
            where: { id: roleId } 
        });
        
        if (!existingRole) {
            throw new BadRequestException(
                `Role with id ${roleId} could not be retrieved for update`
            );
        }

        const updatedRole = this.roleRepository.merge(existingRole, updateRoleDto);
        return this.roleRepository.save(updatedRole);
    }

    /**
     * Deletes a role by ID
     * @param roleId - ID of the role to delete
     * @returns Promise<Role> - The removed role entity
     * @throws BadRequestException if role doesn't exist
     */
    async deleteRoles(roleId: number): Promise<Role> {
        const role = await this.roleRepository.findOneBy({ id: roleId });
        
        if (!role) {
            throw new BadRequestException(
                `Role with id ${roleId} does not exist!`
            );
        }
        
        return this.roleRepository.remove(role);
    }

    /**
     * Retrieves roles by their names
     * @param roleNames - Array of role names to search for
     * @returns Promise<Role[]> - Array of matching role entities
     */
    async getRolesByNames(roleNames: string[]): Promise<Role[]> {
        return this.roleRepository.find({
            where: {
                name: In(roleNames) // Efficient query for multiple role names
            }
        });
    }
}