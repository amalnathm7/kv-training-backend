import { Repository } from "typeorm";
import Department from "../entity/department.entity";

class DepartmentRepository {
    constructor(private departmentRepository: Repository<Department>) { }

    findAllDepartments(): Promise<Department[]> {
        return this.departmentRepository.find({
        });
    }

    findDepartmentById(id: string): Promise<Department> {
        return this.departmentRepository.findOne({
            where: {
                id: id,
            },
        });
    }

    saveDepartment(employee: Department): Promise<Department> {
        return this.departmentRepository.save(employee);
    }

    deleteDepartment(employee: Department): Promise<Department> {
        return this.departmentRepository.softRemove(employee);
    }
}

export default DepartmentRepository;