import { ValidIdPipe } from 'src/common/pipe/valid-id-pipe';
import { UserService } from './user.service';
import { Body, Controller, Delete, Get, Param, Patch } from "@nestjs/common";
import { UpdateUserDto } from './dto/update-user.dto';
 import { Private } from '@common/decorator/private.decorator';
import { Permissions } from '@role/decorator/permissions.decorator';
import { Permission } from '@role/enum/permission.enum';
 
@Controller("users")
@Private()
 export class UserController {
   constructor(
      private readonly userService: UserService
   ) { }

   @Get()
   @Permissions(Permission.ViewUsers)
    async getUsers() {
      return this.userService.findUsers()
   }

   @Get(':userId')
   @Permissions(Permission.ViewUser)
   async getUser(@Param('userId', ValidIdPipe) userId: number) {
      return this.userService.findUser(userId)
   }

   @Patch(":userId")
   @Permissions(Permission.UpdateUser)
   async updateUser(@Param("userId", ValidIdPipe) userId: number, @Body() updateUserDto: UpdateUserDto) {
      return this.userService.updateUser(userId, updateUserDto)
   }

   @Delete(":userId")
   @Permissions(Permission.RemoveUser)
   async removeUser(@Param("userId", ValidIdPipe) userId: number) {
      return this.userService.removeUser(userId)

   }


}