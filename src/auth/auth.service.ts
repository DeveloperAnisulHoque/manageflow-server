import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "@user/dto/create-user.dto";
import { UserService } from "@user/user.service";
import { comparePassword } from "@common/util/crypto";
import { JwtService } from "@nestjs/jwt";
import { ResponseUserDto } from "@user/dto/response-user.dto";
import { plainToInstance } from "class-transformer";
import { UpdateUserDto } from "@user/dto/update-user.dto";
import { EmailService } from "src/email/email.service";

/**
 * AuthService handles all authentication and authorization logic including:
 * - User registration and login
 * - JWT token generation
 * - User validation
 * - Profile management
 */
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly emailService: EmailService,
        private readonly jwtService: JwtService,
    ) {}

    /**
     * Registers a new user in the system
     * @param createUserDto DTO containing user registration data
     * @returns Promise with the created user
     * @note Sends a welcome email to the new user (fire-and-forget)
     */
    async register(createUserDto: CreateUserDto) {
        // Send welcome email (handled asynchronously, errors are logged but don't fail registration)
        this.emailService
            .sendWelcomeEmail(createUserDto.email ?? '', createUserDto.name ?? '')
            .catch((error) => {
                console.error('Failed to send welcome email:', error);
            });

        return this.userService.createUser(createUserDto);
    }

    /**
     * Generates a JWT token for an authenticated user
     * @param user User data to include in the token payload
     * @returns Object containing the access token
     */
    async login(user: Partial<ResponseUserDto>) {
        const accessToken = this.jwtService.sign({
            sub: user.id,        // Subject (user ID)
            email: user.email,   // User email
            roles: user.roles,   // User roles for authorization
        });

        return {
            access_token: accessToken,
        };
    }

    /**
     * Validates user credentials against stored data
     * @param email User's email address
     * @param password Plaintext password to validate
     * @returns User object if credentials are valid
     * @throws BadRequestException if user doesn't exist
     */
    async validateUser(email: string, password: string) {
        const user = await this.userService.findUserByEmail(email);

        if (!user) {
            throw new BadRequestException("User does not exist for the given email");
        }

        const isPasswordCorrect = await comparePassword(password, user.password);
        if (isPasswordCorrect) {
            return user;
        }
        return null;
    }

    /**
     * Retrieves the profile of the currently authenticated user
     * @param id User ID from JWT token
     * @returns User profile data
     * @throws UnauthorizedException if ID is not provided
     */
    async getCurrentUserProfile(id: number) {
        if (!id) {
            throw new UnauthorizedException("User ID is required!");
        }
        const profile = await this.userService.findUserById(id);
        return plainToInstance(ResponseUserDto, profile);  // Transform to response DTO
    }

    /**
     * Updates user profile information
     * @param id User ID to update
     * @param updateUserDto DTO containing updated user data
     * @returns Updated user profile
     */
    async updateProfile(id: number, updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
        return this.userService.updateUser(id, updateUserDto);
    }
}