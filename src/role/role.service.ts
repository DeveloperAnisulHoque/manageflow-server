import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "./entity/role.entity";
import { CreateRoleDto } from "./dto/create-role-dto";
import { UpdateRoleDto } from "./dto/update-role-dto";


@Injectable()
export class RoleService {

    constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) {

    }

    async getRoles() {
        return this.roleRepository.find()
    }

    async createRoles(createRoleDto: CreateRoleDto) {
        const newRole = this.roleRepository.create(createRoleDto)
        return this.roleRepository.save(newRole)
    }

    async updateRoles(roleId: number, updateRoleDto: UpdateRoleDto) {
        const existingRole = await this.roleRepository.findOneByOrFail({ id: roleId });
        if (!existingRole) {
            throw new BadRequestException()
        }
        const updatedRole = this.roleRepository.merge(existingRole, updateRoleDto);
        return this.roleRepository.save(updatedRole);
    }


    async deleteRoles(roleId: number) {
        const role = await this.roleRepository.findOneByOrFail({ id: roleId });
        if (!role) {
            throw new BadRequestException()
        }
        return this.roleRepository.remove(role);
    }

}