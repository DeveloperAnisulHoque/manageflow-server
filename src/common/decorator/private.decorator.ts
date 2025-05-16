import { JwtAuthGuard } from "@auth/guard/jwt-auth.guard copy";
import { UseGuards } from "@nestjs/common";

 

 export const Private=()=>UseGuards(JwtAuthGuard)