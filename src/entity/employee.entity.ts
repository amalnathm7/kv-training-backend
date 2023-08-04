import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import Address from "./address.entity";
import { AbstractEntity } from "./abstract.entity";
import { Status } from "../utils/status.enum";
import Department from "./department.entity";
import { Role } from "./role.entity";

@Entity()
class Employee extends AbstractEntity {
    @Column()
    name: string;

    @Column()
    username: string;

    @Column()
    password: string

    @Column()
    joiningDate: string

    @Column()
    experience: number

    @ManyToOne(() => Department, (department) => department.employees)
    department: Department;

    @Column()
    status: Status;

    @OneToOne(() => Address, (address) => address.employee, { cascade: true })
    address: Address;

    @ManyToOne(() => Role, (role) => role.employees)
    role: Role
}

export default Employee;