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

/**
 * UserService handles all business logic related to user management
 * including user creation, authentication, profile management, and role assignment.
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  /**
   * Finds a user by their email address including their roles
   * @param email - The email address to search for
   * @returns Promise<User | null> - The user entity if found, null otherwise
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ["roles"],
    });
  }

  /**
   * Finds a user by their ID including their roles and assigned projects
   * @param id - The user ID to search for
   * @returns Promise<User | null> - The user entity if found, null otherwise
   */
  async findUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ["roles", "assignedProjects"],
    });
  }

  /**
   * Retrieves a user by ID and transforms it into a response DTO
   * @param userId - The ID of the user to retrieve
   * @returns Promise<ResponseUserDto> - The user data in response DTO format
   */
  async findUser(userId: number): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return plainToInstance(ResponseUserDto, user);
  }

  /**
   * Retrieves all users with their role names
   * @returns Promise<ResponseUserDto[]> - Array of users in response DTO format
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
   * Updates user information including password and roles
   * @param userId - The ID of the user to update
   * @param updateUserDto - The data to update
   * @returns Promise<ResponseUserDto> - The updated user in response DTO format
   * @throws BadRequestException if user is not found
   */
  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
    const existingUser = await this.findUserById(userId);
    if (!existingUser) {
      throw new BadRequestException(MESSAGES.USER_MESSAGES.NOT_FOUND(userId));
    }

    Object.assign(existingUser, updateUserDto);

    if (updateUserDto.password) {
      existingUser.password = await hashPassword(updateUserDto.password);
    }

    if (updateUserDto.roles) {
      existingUser.roles = await this.roleService.getRolesByNames(updateUserDto.roles);
    }

    const savedUser = await this.userRepository.save(existingUser);
    return plainToInstance(ResponseUserDto, savedUser);
  }

  /**
   * Deletes a user by their ID
   * @param userId - The ID of the user to delete
   * @returns Promise<{ message: string }> - Success message
   * @throws BadRequestException if user is not found
   */
  async removeUser(userId: number): Promise<{ message: string }> {
    const result = await this.userRepository.delete(userId);
    if (!result.affected) {
      throw new BadRequestException(MESSAGES.USER_MESSAGES.NOT_FOUND);
    }

    return {
      message: MESSAGES.USER_MESSAGES.DELETE_SUCCESS,
    };
  }

  /**
   * Creates a new user with hashed password and default 'Client' role if none specified
   * @param createUserDto - The user data to create
   * @returns Promise<ResponseUserDto> - The created user in response DTO format
   * @throws BadRequestException if email already exists
   */
  async createUser(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const existingUser = await this.findUserByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException(MESSAGES.USER_MESSAGES.ALREADY_EXISTS);
    }

    const hashedPassword = await hashPassword(createUserDto.password);
    const assignedRoles = await this.roleService.getRolesByNames(
      createUserDto.roles ?? ["Client"] // Default to 'Client' role if none specified
    );

    const newUser = this.userRepository.create({
      ...createUserDto,
      roles: assignedRoles,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);
    return plainToInstance(ResponseUserDto, savedUser);
  }

  /**
   * Updates a user's profile picture
   * @param userId - The ID of the user to update
   * @param file - The new profile picture file
   * @returns Promise<ResponseUserDto> - The updated user in response DTO format
   * @throws BadRequestException if user is not found
   */
  async updateUserProfilePicture(userId: number, file: Express.Multer.File): Promise<ResponseUserDto> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new BadRequestException(MESSAGES.USER_MESSAGES.NOT_FOUND(userId));
    }

    // Clean up previous image if exists
    if (user.profilePicture) {
      await this.fileStorageService.delete(user.profilePicture).catch(err => {
        console.warn("Failed to delete previous image:", err.message);
      });
    }

    // Upload and update with new image
    const uploadResult = await this.fileStorageService.upload(file);
    user.profilePicture = uploadResult.url;
    
    const savedUser = await this.userRepository.save(user);
    return plainToInstance(ResponseUserDto, savedUser);
  }
}