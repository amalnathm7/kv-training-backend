import { Repository } from "typeorm";
import Employee from "../entity/employee.entity";

class EmployeeRepository {
    constructor(private employeeRepository: Repository<Employee>) { }

    findAllEmployees(): Promise<Employee[]> {
        return this.employeeRepository.find({
            relations: {
                address: true,
                department: true,
            }
        });
    }

    findEmployeeById(id: number): Promise<Employee> {
        return this.employeeRepository.findOne({
            where: {
                id: id,
            },
            relations: {
                address: true,
                department: true,
            }
        });
    }

    findEmployeeByEmail(email: string): Promise<Employee> {
        return this.employeeRepository.findOneBy({ email });
    }

    saveEmployee(employee: Employee): Promise<Employee> {
        return this.employeeRepository.save(employee);
    }

    deleteEmployee(employee: Employee): Promise<Employee> {
        return this.employeeRepository.softRemove(employee);
    }
}

export default EmployeeRepository;