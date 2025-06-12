import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@user/entity/user.entity";
import { In, Repository } from "typeorm";

/**
 * SharedUserService provides common user-related operations that can be used across multiple modules.
 * This centralized service helps maintain consistency in user data access and reduces code duplication.
 */
@Injectable()
export class SharedUserService {
    constructor(
        @InjectRepository(User) 
        private readonly userRepository: Repository<User>
    ) {}

    /**
     * Retrieves a single user by their unique identifier
     * @param id - The numeric ID of the user to retrieve
     * @returns Promise<User> - The found user entity
     * @throws EntityNotFoundError if no user exists with the given ID
     * 
     * @example
     * const user = await sharedUserService.getUserById(123);
     */
    async getUserById(id: number): Promise<User> {
        return this.userRepository.findOneByOrFail({ id });
    }

    /**
     * Retrieves multiple users by their IDs in a single query
     * @param ids - Array of numeric user IDs to retrieve
     * @returns Promise<User[]> - Array of user entities
     * @note Returns only the users that exist (no error thrown for missing IDs)
     * 
     * @example
     * const users = await sharedUserService.getUsersByIds([123, 456, 789]);
     */
    async getUsersByIds(ids: number[]): Promise<User[]> {
        return this.userRepository.findBy({ 
            id: In(ids) // Using TypeORM's In operator for efficient multi-ID lookup
        });
    }
}