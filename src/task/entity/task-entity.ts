import { BaseEntity } from "@common/entity/base.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";
 import { User } from "@user/entity/user.entity";
import { TaskStatus } from "@task/enum/task-status-enum";
import { Project } from "@project/entity/project-entity";
 
@Entity({ name: "tasks" })
export class Task extends BaseEntity {

    @Column()
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @Column({ default: TaskStatus.TODO })
    status: string;  

    @Column({ type: "int", default: 0 })
    progress: number;

    @Column({ type: "timestamp", nullable: true })
    dueDate: Date;

    @ManyToOne(() => Project, project => project.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "projectId" })
    project: Project;

    @ManyToMany(() => User, user => user.assignedTasks)
    @JoinTable({
        name: "tasks_users",
        joinColumn: { name: "task_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "user_id", referencedColumnName: "id" },
    })
    assignedUsers: User[];

    @ManyToOne(() => User, user => user.createdTasks)
    @JoinColumn({ name: "createdBy" })
    createdBy: User;

    @ManyToOne(() => User, user => user.updatedTasks)
    @JoinColumn({ name: "updatedBy" })
    updatedBy: User;
}
