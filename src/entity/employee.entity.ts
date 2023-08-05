import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import Address from "./address.entity";
import { AbstractEntity } from "./abstract.entity";
import { Status } from "../utils/status.enum";
import Department from "./department.entity";
import Role from "./role.entity";

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

    @ManyToOne(() => Department, { nullable: true })
    department: Department;

    @Column()
    status: Status;

    @OneToOne(() => Address, (address) => address.employee, { cascade: true })
    address: Address;

    @ManyToOne(() => Role, { nullable: true })
    role: Role
}

export default Employee;