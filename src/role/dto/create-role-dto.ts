import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateRoleDto{
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(15)
    name:string
}