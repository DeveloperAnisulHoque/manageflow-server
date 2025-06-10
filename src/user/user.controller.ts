import { ValidIdPipe } from 'src/common/pipe/valid-id-pipe';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Private } from '@common/decorator/private.decorator';
import { Permissions } from '@role/decorator/permissions.decorator';
import { Permission } from '@role/enum/permission.enum';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
@Private() // Ensures all routes are protected by authentication
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * GET /users
   * Returns a list of all users.
   * Requires the "ViewUsers" permission.
   */
  @Get()
  @Permissions(Permission.ViewUsers)
  async getUsers() {
    return this.userService.findUsers();
  }

  /**
   * GET /users/:userId
   * Returns details of a single user by ID.
   * Requires the "ViewUser" permission.
   */
  @Get(':userId')
  @Permissions(Permission.ViewUser)
  async getUser(@Param('userId', ValidIdPipe) userId: number) {
    return this.userService.findUser(userId);
  }

  /**
   * PATCH /users/profile-picture
   * Updates the profile picture of the currently authenticated user.
   * Requires the "UpdateProfile" permission.
   * Uses Multer interceptor to handle file upload.
   */
  @Patch('profile-picture')
  @Permissions(Permission.UpdateProfile)
  @UseInterceptors(FileInterceptor('file'))
  async updateProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    return this.userService.updateUserProfilePicture(req.user.id, file);
  }

  /**
   * PATCH /users/:userId
   * Updates a user's information by ID.
   * Requires the "UpdateUser" permission.
   */
  @Patch(':userId')
  @Permissions(Permission.UpdateUser)
  async updateUser(
    @Param('userId', ValidIdPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, updateUserDto);
  }

  /**
   * DELETE /users/:userId
   * Deletes a user by ID.
   * Requires the "RemoveUser" permission.
   */
  @Delete(':userId')
  @Permissions(Permission.RemoveUser)
  async removeUser(@Param('userId', ValidIdPipe) userId: number) {
    return this.userService.removeUser(userId);
  }
}
