import { Employee } from "../entity/employee.entity";
import EmployeeRepository from "../repository/employee.repository";

class EmployeeService {
    constructor(private employeeRepository: EmployeeRepository) { }

    getAllEmployees(): Promise<Employee[]> {
        return this.employeeRepository.findAllEmployees();
    }

    getEmployeeById(id: number): Promise<Employee | null> {
        return this.employeeRepository.findOneEmployeeById(id);
    }

    createEmployee(name: string, email: string): Promise<Employee> {
        const newEmployee = new Employee();
        newEmployee.name = name;
        newEmployee.email = email;
        return this.employeeRepository.saveEmployee(newEmployee);
    }

    async deleteEmployee(id: number): Promise<boolean> {
        const employee = await this.getEmployeeById(id);
        
        if (employee) {
            this.employeeRepository.deleteEmployee(employee);
            return true;
        }
        else {
            return false;
        }
    }

    async setEmployee(id: number, name: string, email: string): Promise<boolean> {
        const employee = await this.getEmployeeById(id);

        if (employee) {
            employee.name = name;
            employee.email = email;
            this.employeeRepository.saveEmployee(employee);
            return true;
        }
        else {
            return false;
        }
    }

    async updateEmployee(id: number, name: string, email: string): Promise<boolean> {
        const employee = await this.getEmployeeById(id);

        if (employee) {
            if (name) {
                employee.name = name;
            }
            if (email) {
                employee.email = email;
            }
            this.employeeRepository.saveEmployee(employee);
            return true;
        }
        else {
            return false;
        }
    }
}

export default EmployeeService;