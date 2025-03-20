import { ValidIdPipe } from 'src/common/pipe/valid-id-pipe';
import { UserService } from './user.service';
import { Body, Controller, Delete, Get, Param, Patch } from "@nestjs/common";
import { UpdateUserDto } from './dto/update-user.dto';

@Controller("users")
export class UserController{
    constructor(
        private readonly userService:UserService
    ){}

   @Get()
  async getUsers(){
     return this.userService.findUsers()
  }
 
 @Get(':userId')
 async getUser(@Param('userId',ValidIdPipe) userId:number){
  return   this.userService.findUser(userId)
 }
  
@Patch(":userId")
 async updateUser(@Param("userId",ValidIdPipe) userId:number,@Body() updateUserDto:UpdateUserDto){
    return this.userService.updateUser(userId,updateUserDto)
   }
   
   @Delete(":userId")
   async removeUser(@Param("userId",ValidIdPipe) userId:number){
   return this.userService.removeUser(userId)
   
}


}