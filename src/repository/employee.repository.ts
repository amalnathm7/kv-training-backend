import { Repository } from "typeorm";
import Employee from "../entity/employee.entity";

class EmployeeRepository {
    constructor(private employeeRepository: Repository<Employee>) { }

    findAllEmployees(offset: number): Promise<[Employee[], number]> {
        let paginationCount = 10;

        return this.employeeRepository.findAndCount({
            order: {
                createdAt: "asc",
            },
            skip: offset * paginationCount,
            take: paginationCount,
            relations: {
                address: true,
                department: true,
                role: true
            }
        });
    }

    findEmployeeById(id: string): Promise<Employee | null> {
        return this.employeeRepository.findOne({
            where: { id },
            relations: {
                address: true,
                department: true,
                role: true
            }
        });
    }

    findEmployeeByUsername(username: string): Promise<Employee | null> {
        return this.employeeRepository.findOne({
            where: { username },
            relations: {
                address: true,
                department: true,
                role: true
            }
        });
    }

    saveEmployee(employee: Employee): Promise<Employee> {
        return this.employeeRepository.save(employee);
    }

    deleteEmployee(employee: Employee): Promise<Employee> {
        return this.employeeRepository.softRemove(employee);
    }
}

export default EmployeeRepository;