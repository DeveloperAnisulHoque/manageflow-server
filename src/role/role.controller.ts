import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { RoleService } from './role.service';
import { CreateRoleDto } from "./dto/create-role-dto";
import { ValidIdPipe } from "@common/pipe/valid-id-pipe";
import { UpdateRoleDto } from "./dto/update-role-dto";
import { Private } from "@common/decorator/private.decorator";
import { Permissions } from "./decorator/permissions.decorator";
import { Permission } from "./enum/permission.enum";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from './entity/role.entity';

/**
 * RoleController handles all HTTP requests related to role management.
 * 
 * @ApiTags('Roles') - Groups all role endpoints in Swagger UI
 * @ApiBearerAuth() - Indicates these endpoints require Bearer token authentication
 * @Private() - Requires authentication for all endpoints
 */
@ApiTags('Roles')
@ApiBearerAuth()
@Controller("roles")
@Private()
export class RoleController {
   constructor(private readonly roleService: RoleService) {}

   /**
    * Retrieves all system roles
    * @Permissions(Permission.ViewRoles) - Requires ViewRoles permission
    * @ApiOperation - Swagger description
    * @ApiResponse - Documents possible responses
    * @returns Promise<Role[]> Array of role entities
    */
   @Get()
   @Permissions(Permission.ViewRoles)
   async getRoles() {
      return this.roleService.getRoles();
   }

   /**
    * Creates a new system role
    * @Permissions(Permission.CreateRole) - Requires CreateRole permission
    * @param createRoleDto Role creation data
    * @returns Promise<Role> Newly created role
    */
   @Post()
   @Permissions(Permission.CreateRole)
   async createRole(@Body() createRoleDto: CreateRoleDto) {
      return this.roleService.createRoles(createRoleDto);
   }

   /**
    * Updates an existing role
    * @Permissions(Permission.UpdateRole) - Requires UpdateRole permission
    * @param roleId Role ID (validated by ValidIdPipe)
    * @param updateRoleDto Role update data
    * @returns Promise<Role> Updated role entity
    */
   @Patch(':roleId')
   @Permissions(Permission.UpdateRole)
   async updateRole(
      @Param("roleId", ValidIdPipe) roleId: number, 
      @Body() updateRoleDto: UpdateRoleDto
   ) {
      return this.roleService.updateRoles(roleId, updateRoleDto);
   }

   /**
    * Deletes a role from the system
    * @Permissions(Permission.RemoveRole) - Requires RemoveRole permission
    * @param roleId Role ID (validated by ValidIdPipe)
    * @returns Promise<void>
    */
   @Delete(":roleId")
   @Permissions(Permission.RemoveRole)
   async removeRole(@Param("roleId", ValidIdPipe) roleId: number) {
      return this.roleService.deleteRoles(roleId);
   }
}