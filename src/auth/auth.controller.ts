import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "@user/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { Private } from "../common/decorator/private.decorator";
import { UpdateUserDto } from "@user/dto/update-user.dto";


@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }



    @Post("register")
    @HttpCode(HttpStatus.OK)
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto)
    }


    @Post("login")
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    async login(@Request() req: any) {
        return this.authService.login(req.user)
    }

    @Get("profile")
    @Private()
    async getProfile(@Request() request: any) {

        return this.authService.getCurrentUserProfile(request.user?.id)
    }

    @Patch("profile")
    @Private()
    async updateProfile(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
        return await this.authService.updateProfile(req.user?.id, updateUserDto)
    }


}