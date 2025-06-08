import { ProjestStatus } from "@project/enum/project-status-enum";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";



export class CreateProjectDto{

    @IsString()
    @IsNotEmpty()
    name:string

    @IsString()
    @IsNotEmpty()
    description:string

    @IsOptional()
    @IsEnum(ProjestStatus)
    status?:string

    @IsOptional()
    progress?:number
}