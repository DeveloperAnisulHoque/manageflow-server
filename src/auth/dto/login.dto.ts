import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"


export class LoginDto{
    @IsEmail()
    email:string
    @IsNotEmpty()
    @IsString()
    @MinLength(8,{message:"Password must contain at least 8 characters"})
    @MaxLength(20,{message:"Password must be less than 20 characters"})
    password:string
}