import { Role } from "@role/enum/role.enum";
import { IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateRoleDto{
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(15)
    @IsEnum(Role, { each: true, message: "role  must be a valid role from role enum" })
    name:string
}