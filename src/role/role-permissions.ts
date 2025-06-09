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
        Permission.ViewProject,
        Permission.ViewProjects,
        Permission.CreateProject,
        Permission.UpdateProject,
        Permission.RemoveProject,
        Permission.SuperOwner,
    ],
    [Role.Client]:[
        Permission.ViewProfile,
        Permission.UpdateProfile,
        Permission.ViewProject,
    ],
    [Role.Member]:[
        Permission.ViewProfile,
        Permission.UpdateProfile,
        Permission.ViewUser,
        Permission.ViewUsers,
        // Permission.ViewProject,
    ],
    [Role.ProjectManager]:[
        Permission.ViewProfile,
        Permission.UpdateProfile,
        Permission.ViewUser,
        Permission.ViewUsers,
        Permission.ViewProject,
        Permission.UpdateUser,
    ],
    [Role.TeamLead]:[
        Permission.ViewProfile,
        Permission.UpdateProfile,
        Permission.ViewUser,
        Permission.ViewUsers,
        Permission.ViewProject,
    ],
}