import { Repository } from "typeorm";
import Employee from "../entity/employee.entity";

class EmployeeRepository {
    constructor(private employeeRepository: Repository<Employee>) { }

    findAllEmployees(): Promise<Employee[]> {
        return this.employeeRepository.find({
            relations: {
                address: true,
                department: true,
                role: true
            }
        });
    }

    findEmployeeById(id: string): Promise<Employee> {
        return this.employeeRepository.findOne({
            where: {
                id: id,
            },
            relations: {
                address: true,
                department: true,
                role: true
            }
        });
    }

    findEmployeeByUsername(username: string): Promise<Employee> {
        return this.employeeRepository.findOneBy({ username });
    }

    saveEmployee(employee: Employee): Promise<Employee> {
        return this.employeeRepository.save(employee);
    }

    deleteEmployee(employee: Employee): Promise<Employee> {
        return this.employeeRepository.softRemove(employee);
    }
}

export default EmployeeRepository;