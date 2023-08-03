import Address from "../entity/address.entity";
import { Employee } from "../entity/employee.entity";
import HttpException from "../exception/http.exception";
import EmployeeRepository from "../repository/employee.repository";

class EmployeeService {
    constructor(private employeeRepository: EmployeeRepository) { }

    getAllEmployees(): Promise<Employee[]> {
        return this.employeeRepository.findAllEmployees();
    }

    async getEmployeeById(id: number): Promise<Employee | null> {
        const employee = await this.employeeRepository.findOneEmployeeById(id);

        if (!employee) {
            throw new HttpException(404, "Employee not found");
        }

        return employee;
    }

    createEmployee(name: string, email: string, address: any): Promise<Employee> {
        const newEmployee = new Employee();
        newEmployee.name = name;
        newEmployee.email = email;

        const newAddress = new Address();
        newAddress.line1 = address.line1;
        newAddress.pincode = address.pincode;

        newEmployee.address = newAddress;
        return this.employeeRepository.saveEmployee(newEmployee);
    }

    async deleteEmployee(id: number): Promise<void> {
        const employee = await this.getEmployeeById(id);
        
        this.employeeRepository.deleteEmployee(employee);
    }

    async updateEmployee(id: number, name: string, email: string, address: any): Promise<void> {
        const employee = await this.getEmployeeById(id);

        employee.name = name;
        employee.email = email;

        if (address) {
            employee.address.line1 = address.line1;
            employee.address.pincode = address.pincode;
        }

        this.employeeRepository.saveEmployee(employee);
    }
}

export default EmployeeService;