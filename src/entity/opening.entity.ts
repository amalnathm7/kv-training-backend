import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import Department from "./department.entity";
import Role from "./role.entity";
import Referral from "./referral.entity";

@Entity()
class Opening extends AbstractEntity {
    @Column()
    title: string;

    @Column()
    descrption: string;

    @Column()
    skills: string

    @Column()
    count: number

    @Column()
    location: string

    @Column()
    experience: number

    @ManyToOne(() => Department, { nullable: true })
    department: Department;

    @ManyToOne(() => Role, { nullable: true })
    role: Role

    @OneToMany(() => Referral, (referral) => referral.opening)
    referrals: Referral[]
}

export default Opening;