import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "@user/dto/create-user.dto";
import { UserService } from "@user/user.service";
import { comparePassword } from "@common/util/crypto";
import { JwtService } from "@nestjs/jwt";
import { ResponseUserDto } from "@user/dto/response-user.dto";
import { plainToInstance } from "class-transformer";
import { UpdateUserDto } from "@user/dto/update-user.dto";
import { EmailService } from "src/email/email.service";
 

@Injectable()
export class AuthService {


    constructor(
        private readonly userService: UserService,
        private readonly emailService: EmailService,
        private readonly jwtService: JwtService,
 
    ) {

    }

  async register(createUserDto: CreateUserDto) {
    
  // Send welcome email
  this.emailService
    .sendWelcomeEmail(createUserDto.email ?? '', createUserDto.name ?? '')
    .catch((error) => {
      console.error('Failed to send welcome email:', error);
    });

  return this.userService.createUser(createUserDto);
}


    async login(user: Partial<ResponseUserDto>) {
        const accessToken = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            roles: user.roles,
        });

        return {
            access_token: accessToken,
        };
    }


    async validateUser(email: string, password: string) {
        const user = await this.userService.findUserByEmail(email)

        if (!user) {
            throw new BadRequestException("User does not exist for the given email")
        }

        const isPasswordCorrect = await comparePassword(password, user.password)
        if (isPasswordCorrect) {
            return user
        }
        return null
    }

    async getCurrentUserProfile(id: number) {
        if (!id) {
            throw new UnauthorizedException("user id is required !")
        }
        const profile = await this.userService.findUserById(id)
        return plainToInstance(ResponseUserDto, profile)
    }

    async updateProfile(id: number, updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
        return this.userService.updateUser(id, updateUserDto)
    }
}
