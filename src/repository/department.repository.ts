import { Repository } from "typeorm";
import Department from "../entity/department.entity";

class DepartmentRepository {
    constructor(private departmentRepository: Repository<Department>) { }

    findAllDepartments(): Promise<Department[]> {
        return this.departmentRepository.find({
        });
    }

    findDepartmentById(id: string): Promise<Department | null> {
        return this.departmentRepository.findOne({
            where: {
                id: id,
            },
        });
    }

    saveDepartment(department: Department): Promise<Department> {
        return this.departmentRepository.save(department);
    }

    deleteDepartment(department: Department): Promise<Department> {
        return this.departmentRepository.softRemove(department);
    }
}

export default DepartmentRepository;