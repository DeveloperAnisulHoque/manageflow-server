import { MESSAGES } from "@common/messages";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RolePermissions } from "@role/role-permissions";


@Injectable()
export class PermissionGuard implements CanActivate {

    constructor(private Reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.Reflector.getAllAndMerge<string[]>(
            "permissions", [context.getClass(), context.getHandler()]
        )

        if (!requiredPermissions) {
            return true
        }

        const request = context.switchToHttp().getRequest()

        const userRoles = request.user?.roles ?? []
        let userPermissions = userRoles.flatMap(({ name }: { name: string }) => RolePermissions[name] ?? [])

        userPermissions = [...new Set(userPermissions)]

        const hasPermission = requiredPermissions.every(permission => userPermissions.includes(permission))

        if (!hasPermission) {
            throw new UnauthorizedException(MESSAGES.PERMISSION_MESSAGES.UNAUTHORIZED);
        }
        return hasPermission
    }
}