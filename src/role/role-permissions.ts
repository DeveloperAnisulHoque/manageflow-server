import { Permission } from "./enum/permission.enum";
import { Role } from "./enum/role.enum";

export const RolePermissions={
    [Role.Admin]:[
        Permission.ViewProfile,
        Permission.UpdateProfile,
        Permission.ViewUser,
        Permission.ViewUsers,
        Permission.RemoveUser,
        Permission.UpdateUser,
    ],
    [Role.Client]:[
        Permission.ViewProfile,
        Permission.UpdateProfile,
    ],
    [Role.Member]:[
        Permission.ViewProfile,
        Permission.UpdateProfile,
        Permission.ViewUser,
        Permission.ViewUsers,
    ],
    [Role.ProjectManager]:[
        Permission.ViewProfile,
        Permission.UpdateProfile,
        Permission.ViewUser,
        Permission.ViewUsers,
    ],
    [Role.TeamLead]:[
        Permission.ViewProfile,
        Permission.UpdateProfile,
        Permission.ViewUser,
        Permission.ViewUsers,
    ],
}