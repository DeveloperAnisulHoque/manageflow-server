import { MESSAGES } from "@common/messages";
import { OwnershipService } from "@common/service/ownership.service";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Permission } from "@role/enum/permission.enum";
import { RolePermissions } from "@role/role-permissions";


@Injectable()
export class PermissionGuard implements CanActivate {

    constructor(private reflector: Reflector,
        private readonly ownershipService:OwnershipService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndMerge<string[]>(
            "permissions", [context.getClass(), context.getHandler()]
        )
        const ownershipMetaData = this.reflector.getAllAndOverride<{ resource: string, paramName: string }>("ownership",
            [
                context.getClass(),
                context.getHandler()
            ]
        )




        if (!requiredPermissions) {
            return true
        }

        const { user, params } = context.switchToHttp().getRequest()

        const userRoles = user?.roles ?? []
        let userPermissions = userRoles.flatMap(({ name }: { name: string }) => RolePermissions[name] ?? [])

        userPermissions = [...new Set(userPermissions)]

        const hasPermission = requiredPermissions.every(permission => userPermissions.includes(permission))

        if (!hasPermission) {
            throw new UnauthorizedException(MESSAGES.PERMISSION_MESSAGES.UNAUTHORIZED);
        }


        
        if (!userPermissions.includes(Permission.SuperOwner) && ownershipMetaData) {
            const { resource, paramName } = ownershipMetaData
            
            const resourceId = params[paramName]
            
            const isOwner = await this.checkForResourceOwnership(resource, resourceId, user.id)
              
            if(!isOwner){

                throw new UnauthorizedException("You do not own this resource!") 
            }
        }

        return hasPermission
    }
    async checkForResourceOwnership(resourceType:string, resourceId:number, userId:number){


         switch(resourceType){
            case "project":
                return this.ownershipService.ownsProject(resourceId, userId)
          
            default:
                return false
            }



    }

}