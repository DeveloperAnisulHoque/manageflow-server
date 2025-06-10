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
import { FileStorageService } from "src/file-storage/file-storage.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  /**
   * Finds a user by their email address.
   */
  async findUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: ["roles"],
    });
  }

  /**
   * Finds a user by their ID, including related roles and assigned projects.
   */
  async findUserById(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ["roles", "assignedProjects"],
    });
  }

  /**
   * Returns a user by ID, transformed into a response DTO.
   */
  async findUser(userId: number): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return plainToInstance(ResponseUserDto, user);
  }

  /**
   * Returns all users along with their role names.
   */
  async findUsers(): Promise<ResponseUserDto[]> {
    const users = await this.userRepository.find({
      relations: ["roles"],
      select: {
        roles: { name: true },
      },
    });

    return plainToInstance(ResponseUserDto, users);
  }

  /**
   * Updates user information such as name, email, password, and roles.
   */
  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
    const existingUser = await this.findUserById(userId);
    if (!existingUser) {
      throw new BadRequestException(MESSAGES.USER_MESSAGES.NOT_FOUND(userId));
    }

    Object.assign(existingUser, updateUserDto);

    if (updateUserDto.password) {
      const hashedPassword = await hashPassword(updateUserDto.password);
      existingUser.password = hashedPassword;
    }

    if (updateUserDto.roles) {
      const assignedRoles = await this.roleService.getRolesByNames(updateUserDto.roles);
      existingUser.roles = assignedRoles;
    }

    const savedUser = await this.userRepository.save(existingUser);
    return plainToInstance(ResponseUserDto, savedUser);
  }

  /**
   * Deletes a user by their ID.
   */
  async removeUser(userId: number) {
    const result = await this.userRepository.delete(userId);
    if (!result.affected) {
      throw new BadRequestException(MESSAGES.USER_MESSAGES.NOT_FOUND);
    }

    return {
      message: MESSAGES.USER_MESSAGES.DELETE_SUCCESS,
    };
  }

  /**
   * Creates a new user with hashed password and assigned roles.
   */
  async createUser(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const existingUser = await this.findUserByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException(MESSAGES.USER_MESSAGES.ALREADY_EXISTS);
    }

    const hashedPassword = await hashPassword(createUserDto.password);
    const assignedRoles = await this.roleService.getRolesByNames(createUserDto.roles ?? ["Client"]);

    const newUser = this.userRepository.create({
      ...createUserDto,
      roles: assignedRoles,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);
    return plainToInstance(ResponseUserDto, savedUser);
  }

  /**
   * Updates a user's profile picture.
   * Deletes the previous image if it exists, uploads the new image,
   * and updates the user's profile picture URL.
   */
  async updateUserProfilePicture(userId: number, file: Express.Multer.File): Promise<ResponseUserDto> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new BadRequestException(MESSAGES.USER_MESSAGES.NOT_FOUND(userId));
    }

    // Delete previous image if exists
    if (user.profilePicture) {
      await this.fileStorageService.delete(user.profilePicture).catch(err => {
        console.warn("Failed to delete previous image:", err.message);
      });
    }

    // Upload new image
    const uploadResult = await this.fileStorageService.upload(file);

    // Update profile picture URL
    user.profilePicture = uploadResult.url;
    const savedUser = await this.userRepository.save(user);
    return plainToInstance(ResponseUserDto, savedUser);
  }
}
