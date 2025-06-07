import { User } from "@user/entity/user.entity";
import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";


@Entity({name:"projects"})
export class Project extends BaseEntity{

    @Column()
    name:string;
    
    @Column('text')
    description:string;

    @Column({default:"Not Started"})
    status:string // Status of the project e.g. "Not Started" , "In Progress" , "Completed"

    @Column({default:0})
    progress:number;

    @ManyToMany(()=>User,user=>user.assignedProjects)
    @JoinTable({
        name:"projects_users",
        joinColumn:{name:"project_id",referencedColumnName:"id"},
        inverseJoinColumn:{name:"user_id",referencedColumnName:"id"},
    })
    assignedUsers:User[]

    @ManyToOne(()=>User,user=>user.createdProjects)
    @JoinColumn({name:"createdBy"})
    createdBy:User
    
    @ManyToOne(()=>User,user=>user.updatedProjects)
    @JoinColumn({name:"createdBy"})
    updatedBy:User
}