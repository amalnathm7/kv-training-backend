import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import Address from "./address.entity";
import { AbstractEntity } from "./abstract.entity";
import Role from "./role.entity";
import Employee from "./employee.entity";
import Opening from "./opening.entity";
import { BonusStatus, CandidateStatus } from "../utils/status.enum";

@Entity()
class Candidate extends AbstractEntity {
    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    experience: number

    @Column()
    phone: string

    @Column()
    status: CandidateStatus;

    @Column()
    resume: string;

    @ManyToOne(() => Employee, {nullable: true})
    referredBy: Employee;

    @OneToOne(() => Address, (address) => address.employee, { cascade: [ "insert", "update"], nullable: false })
    @JoinColumn()
    address: Address;

    @ManyToOne(() => Role)
    role: Role;

    @ManyToOne(() => Opening)
    opening: Opening;

    @Column({ length: 6, default: () => "nanoid(6)", unique: true })
    candidateCode: string;

    @Column({ default: BonusStatus.INACTIVE })
    bonusStatus: BonusStatus;
}

export default Candidate;
