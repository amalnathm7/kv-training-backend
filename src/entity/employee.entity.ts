import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import Address from "./address.entity";
import { AbstractEntity } from "./abstract.entity";
import { EmployeeStatus } from "../utils/status.enum";
import Department from "./department.entity";
import Role from "./role.entity";
import { Exclude } from "class-transformer";
import Candidate from "./candidate.entity";

@Entity()
class Employee extends AbstractEntity {
    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Exclude({ toPlainOnly: true })
    @Column()
    password: string

    @Column()
    phone: string

    @Column()
    joiningDate: string

    @Column()
    experience: number

    @ManyToOne(() => Department, { nullable: true })
    department: Department;

    @ManyToOne(() => Role, { nullable: true })
    role: Role

    @Column()
    status: EmployeeStatus;

    @OneToOne(() => Address, (address) => address.employee, { cascade: true, nullable: false })
    @JoinColumn()
    address: Address;

    @OneToOne(() => Employee, (employee) => employee.referredBy)
    @JoinColumn()
    referredBy: Employee;

    @OneToMany(() => Candidate, (referral) => referral.referredBy)
    referrals: Candidate[]
}

export default Employee;