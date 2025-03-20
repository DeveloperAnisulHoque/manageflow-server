import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { CreateUserDto } from "@user/dto/create-user.dto";
import { AuthService } from "./auth.service";
 

@Controller("auth")
export class AuthController{ 
constructor(
    private readonly authService:AuthService
){}



@Post("register")
@HttpCode(HttpStatus.CREATED)
async register(@Body() createUserDto:CreateUserDto){
    return this.authService.register(createUserDto)
}


async login(){}
async getProfile(){}
async updateProfile(){}


}