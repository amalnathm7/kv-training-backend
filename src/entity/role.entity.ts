import { Column, Entity, OneToMany } from "typeorm";
import { PermissionLevel } from "../utils/permission.level.enum";
import Employee from "./employee.entity";
import { AbstractEntity } from "./abstract.entity";

@Entity()
class Role extends AbstractEntity {
    @Column()
    role: string

    @Column()
    permissionLevel: PermissionLevel

    @OneToMany(() => Employee, (employee) => employee.role)
    employees: Employee[]
}

export default Role;
