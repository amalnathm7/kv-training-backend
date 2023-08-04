import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PermissionLevel } from "../utils/permission.level.enum";
import Employee from "./employee.entity";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    role: string

    @Column()
    permissionLevel: PermissionLevel

    @OneToMany(() => Employee, (employee) => employee.role)
    employees: Employee[]
}