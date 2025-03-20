import { BaseEntity } from "src/common/entity/base.entity";
import { Entity, Column } from "typeorm";

@Entity({ name: "users" })
export class User extends BaseEntity {

    @Column({ type: "varchar", length: 150, unique: true })
    email: string;

    @Column({ type: "varchar", length: 100 })
    name: string

    @Column({ type: "varchar", length: 200 })
    password: string;

    @Column({ name: "profile_picture", type: "varchar", nullable: true })
    profilePicture?: string;

    @Column({ name: "phone_number", type: "varchar", length: 15, nullable: true })
    phoneNumber?: string;

    @Column({ type: "text", nullable: true })
    bio?: string;

    @Column({ name: "address_line1", type: "varchar", length: 255, nullable: true })
    addressLine1?: string;

    @Column({ name: "address_line2", type: "varchar", length: 255, nullable: true })
    addressLine2?: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    city?: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    state?: string;

    @Column({name:"zip_code", type: "varchar", length: 10, nullable: true })
    zipCode?: string;

    @Column({ name:"date_of_birth",type: "date", nullable: true })
    dateOfBirth?: Date;


}
