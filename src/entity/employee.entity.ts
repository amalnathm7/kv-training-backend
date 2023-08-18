import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import Address from "./address.entity";
import { AbstractEntity } from "./abstract.entity";
import { Status } from "../utils/status.enum";
import Department from "./department.entity";
import Role from "./role.entity";
import { Exclude } from "class-transformer";
import Referral from "./referral.entity";

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

    @Column()
    status: Status;

    @OneToOne(() => Address, (address) => address.employee, { cascade: true })
    address: Address;

    @ManyToOne(() => Role, { nullable: true })
    role: Role

    @OneToOne(() => Employee, (employee) => employee.referredBy)
    @JoinColumn()
    referredBy: Employee;

    @OneToMany(() => Referral, (referral) => referral.referredBy)
    referrals: Referral[]
}

export default Employee;