import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import Department from "./department.entity";
import Role from "./role.entity";
import Candidate from "./candidate.entity";
import { instanceToPlain } from "class-transformer";

@Entity()
class Opening extends AbstractEntity {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    skills: string

    @Column()
    count: number

    @Column()
    location: string

    @Column()
    experience: number

    @ManyToOne(() => Department, { nullable: false })
    department: Department;

    @ManyToOne(() => Role, { nullable: false })
    role: Role

    @OneToMany(() => Candidate, (candidate) => candidate.opening)
    candidates: Candidate[]

    toJSON() {
        const plain = instanceToPlain(this);
        plain.createdAt = this.createdAt;
        return plain;
    }
}

export default Opening;