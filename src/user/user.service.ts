import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { hashPassword } from "@common/util/crypto";
import { ResponseUserDto } from "./dto/response-user.dto";
import { plainToInstance } from "class-transformer";
import { UpdateUserDto } from "./dto/update-user.dto";
import { MESSAGES } from "@common/messages";
import { RoleService } from "@role/role.service";


@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly roleService: RoleService
    ) {

    }
    async findUserByEmail(email: string) {
        return this.userRepository.findOne({
            where: {
                email
            }, relations: ["roles"], 
        })
    }
    async findUserById(id: number) {
        return this.userRepository.findOne({
            where: {
                id: id
            },
             relations: ["roles"], 
        })
    }

    async findUser(userId: number): Promise<ResponseUserDto> {
        const user = await this.userRepository.findOne({ where: { id: userId } })
        return plainToInstance(ResponseUserDto, user)
    }
    async findUsers(): Promise<ResponseUserDto[]> {
        const users = await this.userRepository.find({
            relations: ["roles"],
            select: {
                roles: { name: true }
            }
        })

        return plainToInstance(ResponseUserDto, users)
    }

    async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
        const existingUser = await this.findUserById(userId)
        if (!existingUser) {
            throw new BadRequestException(MESSAGES.USER_MESSAGES.NOT_FOUND(userId))
        }
        Object.assign(existingUser, updateUserDto)

        if (updateUserDto.password) {
            const hashedPassword = await hashPassword(updateUserDto.password)
            Object.assign(existingUser, { password: hashedPassword })
        }

        if (updateUserDto.roles) {
            const assignedRoles = await this.roleService.getRolesByNames(updateUserDto.roles)
            Object.assign(existingUser, { roles: assignedRoles })
        }

        const savedUser = await this.userRepository.save(existingUser)

        return plainToInstance(ResponseUserDto, savedUser)
    }


    async removeUser(userId: number) {
        const result = await this.userRepository.delete(userId)
        if (!result.affected) {
            throw new BadRequestException(MESSAGES.USER_MESSAGES.NOT_FOUND)
        }
        return {
            message: MESSAGES.USER_MESSAGES.DELETE_SUCCESS
        }

    }

    async createUser(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
        const existingUser = await this.findUserByEmail(createUserDto.email)

        if (existingUser) {
            throw new BadRequestException(MESSAGES.USER_MESSAGES.ALREADY_EXISTS)
        }

        const hashedPassword = await hashPassword(createUserDto.password)

        const assignedRoles = await this.roleService.getRolesByNames(createUserDto.roles ?? ["Client"]);

        const newUser = this.userRepository.create({ ...createUserDto, roles: assignedRoles, password: hashedPassword })
        const savedUser = this.userRepository.save(newUser)
        return plainToInstance(ResponseUserDto, savedUser)

    }


}