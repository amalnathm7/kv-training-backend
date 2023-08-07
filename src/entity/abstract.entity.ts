import { Exclude, instanceToPlain } from "class-transformer";
import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class AbstractEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Exclude({ toPlainOnly: true })
    @CreateDateColumn()
    createdAt: Date;

    @Exclude({ toPlainOnly: true })
    @UpdateDateColumn()
    updatedAt: Date;

    @Exclude({ toPlainOnly: true })
    @DeleteDateColumn()
    deletedAt: Date;

    toJSON() {
        return instanceToPlain(this);
    }
}