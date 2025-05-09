import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "@user/dto/create-user.dto";
import { UserService } from "@user/user.service";
 import { comparePassword } from "@common/util/crypto";
import { JwtService } from "@nestjs/jwt";
import { ResponseUserDto } from "@user/dto/response-user.dto";


@Injectable()
export class AuthService{
    constructor(
        private readonly userService:UserService,
        private readonly jwtService:JwtService

    ){
    
    }

    async register(createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto)
}

async login(user:Partial<ResponseUserDto>){
const accessToken=this.jwtService.sign({
    sub:user.id,
    email:user.email

})
 

return{
    access_token:accessToken
}
}

async validateUser(email:string,password:string){
    const user=await this.userService.findUserByEmail(email)
    if(!user){
        throw new BadRequestException("User does not exist for the given email")
    }

    const isPasswordCorrect=await comparePassword(password,user.password)
    if(isPasswordCorrect){
        return user
    }
    return null
}


}
