import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { RoleService } from './role.service';
import { CreateRoleDto } from "./dto/create-role-dto";
import { ValidIdPipe } from "@common/pipe/valid-id-pipe";
import { UpdateRoleDto } from "./dto/update-role-dto";


@Controller("roles")
export class RoleController {

   constructor(private readonly roleService: RoleService) { }


   @Get()
   async getRoles() {
      return this.roleService.getRoles()
   }

   @Post()
   async createRole(@Body() createRoleDto: CreateRoleDto) {
      return this.roleService.createRoles(createRoleDto)
   }

   @Patch(':roleId')
   async updateRole(@Param("roleId", ValidIdPipe) roleId: number, @Body() updateRoleDto: UpdateRoleDto) {
      return this.roleService.updateRoles(roleId, updateRoleDto)
   }

   @Delete(":roleId")
   async removeRole(@Param("roleId", ValidIdPipe) roleId: number) {
      return this.roleService.deleteRoles(roleId)
   }
}