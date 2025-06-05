import { Role } from "@role/enum/role.enum";
import { IsArray, IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches } from "class-validator";

export class CreateUserDto {
    @IsEmail({}, { message: "Email must be a valid email address" })
    email: string;

    @IsNotEmpty()
    @Length(2, 20, { message: "Name must be between 2 and 20 characters" })
    name: string

    @IsNotEmpty()
    @Length(8, 20, { message: "Name must be between 8 and 20 characters" })
    password: string;

    @IsOptional()
    @IsString()
    @Matches(/^https?:\/\/.*\.(jpg|jpeg|png|gif)$/, {
        message: "Profile picture must be a valid image URL"
    })
    profilePicture?: string;

    @IsOptional()
    @IsString()
    @Matches(/^\+?[1-9]\d{1,14}$/, {
        message: "Phone number must be a valid international format"
    })
    phoneNumber?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    addressLine1?: string;

    @IsOptional()
    @IsString()
    addressLine2?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @Matches(/^\d{5}(-\d{4})?$/, {
        message: "Zip code must be a valid format (e.g., 1234 or 12345-6789)"
    })
    zipCode?: string;

    @IsOptional()
    @IsDate({ message: "Date of birth must be a valid date" })
    dateOfBirth?: Date;

    @IsOptional()
    @IsArray({ message: "Roles must be an array" })
    @IsEnum(Role, { each: true, message: "Each role must be a valid role from role enum" })
    roles?: string[]


}