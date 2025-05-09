import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "@user/dto/create-user.dto";
import { UserService } from "@user/user.service";
import { LoginDto } from "./dto/login.dto";
import { MESSAGES } from "@common/messages";
import { comparePassword } from "@common/util/crypto";


@Injectable()
export class AuthService{

    constructor(
        private readonly userService:UserService
    ){
    
    }

    async register(createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto)
} 
    async login(loginDto: LoginDto) {

    const user=  await this.validateUser(loginDto.email,loginDto.password)
   if(user){

     return {
       message:MESSAGES.AUTH_MESSAGES.LOGIN_SUCCESS
      }
    }

    throw new UnauthorizedException()

     }


     async validateUser(email:string,password:string){
      const user=  await this.userService.findUserByEmail(email)
 
      if(!user){
        throw new BadRequestException(MESSAGES.USER_MESSAGES.NOT_FOUND_BY_EMAIL)
      }

      const isPasswordCorrect=await comparePassword(password,user.password)
       
      if(isPasswordCorrect){
        return user
      }
      return null

     }
}