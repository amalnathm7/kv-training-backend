import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import Address from "./address.entity";
import { AbstractEntity } from "./abstract.entity";
import Role from "./role.entity";
import Employee from "./employee.entity";
import Opening from "./opening.entity";

@Entity()
class Referral extends AbstractEntity {
    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    experience: number

    @Column()
    phone: string

    @Column()
    status: string;

    @Column()
    resume: string;

    @ManyToOne(() => Employee)
    referredBy: Employee;

    @OneToOne(() => Address, (address) => address.employee, { cascade: true })
    address: Address;

    @ManyToOne(() => Role)
    role: Role;

    @ManyToOne(() => Opening)
    opening: Opening;
}

export default Referral;