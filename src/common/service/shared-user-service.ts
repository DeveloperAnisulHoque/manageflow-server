import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@user/entity/user.entity";
import { Repository } from "typeorm";


@Injectable()
export class SharedUserService{
    constructor(@InjectRepository(User) private readonly userRepository:Repository<User>){}

    async getUserById(id:number){
        return this.userRepository.findOneByOrFail({id})
    }
}