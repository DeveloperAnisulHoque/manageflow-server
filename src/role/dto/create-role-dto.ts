import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateRoleDto{
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MinLength(15)
    name:string
}