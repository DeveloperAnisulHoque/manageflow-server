import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "@user/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
 

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
@UseGuards(AuthGuard("local"))
async login(@Request() req:any){
   return this.authService.login(req.user)
}

async getProfile(){}
async updateProfile(){}


}