import { BadRequestException, Injectable, ParseIntPipe } from "@nestjs/common";

@Injectable()
export class ValidIdPipe extends ParseIntPipe{

           constructor(){

            super({
                exceptionFactory:()=> new BadRequestException(`The "id" parameter must be a valid integer`)
            })
           }


}