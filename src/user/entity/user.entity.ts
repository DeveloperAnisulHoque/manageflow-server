import { BaseEntity } from "src/common/entity/base.entity";
import { Entity, Column } from "typeorm";

@Entity({ name: "users" })
export class User extends BaseEntity {
  
 @Column({type:"varchar",length:150,unique:true})
  email: string;

  @Column({type:"varchar",length:100})
  name:string

  @Column({type:"varchar",length:20})
  password: string;

  @Column({ type:"varchar",nullable: true })
  profilePicture?: string;

  @Column({type:"varchar",length:15, nullable: true })
  phoneNumber?: string;

  @Column({type:"text", nullable: true })
  bio?: string;

  @Column({ type:"varchar",length:255,nullable: true })
  addressLine1?: string;

  @Column({ type:"varchar",length:255,nullable: true })
  addressLine2?: string;

  @Column({ type:"varchar",length:100,nullable: true })
  city?: string;

  @Column({ type:"varchar",length:100,nullable: true })
  state?: string;

  @Column({ type:"varchar",length:10,nullable: true })
  zipCode?: string;

  @Column({ type: "date", nullable: true })
  dateOfBirth?: Date;


}
