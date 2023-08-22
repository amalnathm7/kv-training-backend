import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import Employee from "./employee.entity";
import Candidate from "./candidate.entity";

@Entity()
class Address extends AbstractEntity {
    @Column()
    line1: string;

    @Column()
    line2: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    country: string;

    @Column()
    pincode: string;

    @OneToOne(() => Employee, (employee) => employee.address)
    employee: Employee

    @OneToOne(() => Candidate, (candidate) => candidate.address)
    candidate: Candidate
}

export default Address;