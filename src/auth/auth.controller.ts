import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { CreateUserDto } from "@user/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
 

@Controller("auth")
export class AuthController{ 
constructor(
    private readonly authService:AuthService
){}



@Post("register")
@HttpCode(HttpStatus.OK)
@HttpCode(HttpStatus.CREATED)
async register(@Body() createUserDto:CreateUserDto){
    return this.authService.register(createUserDto)
}


@Post("login")
@HttpCode(HttpStatus.OK)
async login(@Body() loginDto:LoginDto){
  
    return await this.authService.login(loginDto)

}
async getProfile(){}
async updateProfile(){}


}