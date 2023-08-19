import { Repository } from "typeorm";
import Opening from "../entity/opening.entity";

class OpeningRepository {
    constructor(private openingRepository: Repository<Opening>) { }

    findAllEmployees(offset: number, pageLength: number): Promise<[Opening[], number]> {
        return this.openingRepository.findAndCount({
            order: {
                createdAt: "asc",
            },
            skip: offset * pageLength,
            take: pageLength,
            relations: {
                department: true,
                role: true
            }
        });
    }

    findOpeningById(id: string): Promise<Opening | null> {
        return this.openingRepository.findOne({
            where: { id },
            relations: {
                department: true,
                role: true
            }
        });
    }

    saveEmployee(employee: Opening): Promise<Opening> {
        return this.openingRepository.save(employee);
    }

    deleteEmployee(employee: Opening): Promise<Opening> {
        return this.openingRepository.softRemove(employee);
    }
}