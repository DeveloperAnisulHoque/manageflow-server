import { ResponseRoleDto } from "@role/dto/response-role-dto";
import { Exclude } from "class-transformer";

export class ResponseUserDto {
    id:number
    email: string;
    name: string
    
    @Exclude()
    password: string;
    profilePicture?: string;
    phoneNumber?: string;
    bio?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    dateOfBirth?: Date;
    createdAt: Date;
    updatedAt : Date;
    roles:ResponseRoleDto[]

}