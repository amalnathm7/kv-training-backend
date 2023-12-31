import { Repository } from "typeorm";
import Employee from "../entity/employee.entity";

class EmployeeRepository {
    constructor(private employeeRepository: Repository<Employee>) { }

    findAllEmployees(offset: number, pageLength: number): Promise<[Employee[], number]> {
        return this.employeeRepository.findAndCount({
            order: {
                createdAt: "asc",
            },
            skip: offset * pageLength,
            take: pageLength,
            relations: {
                address: true,
                department: true,
                role: true
            }
        });
    }

    findAllEmployeesEmployedFor3Months(): Promise<Employee[]> {
        const currentDate = new Date();
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

        return this.employeeRepository
          .createQueryBuilder('employees')
          .where("employees.referred_by_id IS NOT NULL", { threeMonthsAgo })
          .andWhere("employees.joiningDate <= :threeMonthsAgo", { threeMonthsAgo })
          .getMany();
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

    findEmployeeByEmail(email: string): Promise<Employee | null> {
        return this.employeeRepository.findOne({
            where: { email },
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
