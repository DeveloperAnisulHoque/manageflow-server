import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Request, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "@user/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { Private } from "../common/decorator/private.decorator";
import { UpdateUserDto } from "@user/dto/update-user.dto";
import { RefreshAuthGuard } from "./guard/refresh-auth.guard";

/**
 * AuthController handles all authentication-related HTTP endpoints
 * including registration, login, token refresh, and profile management.
 */
@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    /**
     * Registers a new user account
     * @param createUserDto User registration data
     * @returns Created user information
     */
    @Post("register")
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    /**
     * Authenticates user and returns JWT tokens
     * @param req Request object with authenticated user
     * @returns Access and refresh tokens
     */
    @Post("login")
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    async login(@Request() req: any) {
        return this.authService.login(req.user);
    }

    /**
     * Generates new access token using refresh token
     * @param req Request object containing refresh token
     * @returns New access token
     */
    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    @UseGuards(RefreshAuthGuard)
    async refreshToken(@Request() req: any) {
        const token = req.headers['authorization']?.replace('Bearer ', '');
        return this.authService.refreshAccessToken(token);
    }

    /**
     * Retrieves current authenticated user's profile
     * @param request Request object with user ID
     * @returns User profile data
     */
    @Get("profile")
    @Private()
    async getProfile(@Request() request: any) {
        return this.authService.getCurrentUserProfile(request.user?.id);
    }

    /**
     * Updates current authenticated user's profile
     * @param req Request object with user ID
     * @param updateUserDto Updated profile data
     * @returns Updated user profile
     */
    @Patch("profile")
    @Private()
    async updateProfile(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
        return await this.authService.updateProfile(req.user?.id, updateUserDto);
    }
}