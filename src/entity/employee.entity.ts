import { Column, Entity, Index, ManyToOne, OneToOne } from "typeorm";
import Address from "./address.entity";
import Department from "./department.entity";
import { AbstractEntity } from "./abstract.entity";
import { Role } from "../utils/role.enum";

@Entity()
class Employee extends AbstractEntity {
    @Column()
    name: string;

    @Index({ unique: true })
    @Column()
    email: string;

    @Column()
    password: string

    @OneToOne(() => Address, (address) => address.employee, { cascade: true })
    address: Address;

    @ManyToOne(() => Department, (department) => department.employee)
    department: Department;

    @Column({ default: Role.DEVELOPER })
    role: Role
}

export default Employee;