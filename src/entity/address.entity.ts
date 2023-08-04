import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import Employee from "./employee.entity";

@Entity()
class Address extends AbstractEntity {
    @Column()
    addressLine1: string;

    @Column()
    addressLine2: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    country: string;

    @Column()
    pincode: string;

    @OneToOne(() => Employee, (employee) => employee.address)
    @JoinColumn()
    employee: Employee
}

export default Address;