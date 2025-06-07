import { JwtAuthGuard } from "@auth/guard/jwt-auth.guard copy";
import { UseGuards } from "@nestjs/common";
import { PermissionGuard } from "@role/guard/permission.guard";

 

 export const Private=()=>UseGuards(JwtAuthGuard,PermissionGuard)