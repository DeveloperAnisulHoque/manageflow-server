import { ValidIdPipe } from 'src/common/pipe/valid-id-pipe';
import { UserService } from './user.service';
import { Body, Controller, Delete, Get, Param, Patch, Request, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UpdateUserDto } from './dto/update-user.dto';
import { Private } from '@common/decorator/private.decorator';
import { Permissions } from '@role/decorator/permissions.decorator';
import { Permission } from '@role/enum/permission.enum';
import { FileInterceptor } from '@nestjs/platform-express';

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

   @Patch('profile-picture')
   @Permissions(Permission.UpdateProfile)
   @UseInterceptors(FileInterceptor('file'))
   async updateProfilePicture(
      // @Param('userId', ValidIdPipe) userId: number,
      @UploadedFile() file: Express.Multer.File,@Request() req: any
   ) {
      
      return this.userService.updateUserProfilePicture(req?.user?.id, file);
   }


}