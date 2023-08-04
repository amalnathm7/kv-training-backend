import CreateEmployeeDto from "../dto/create-employee.dto";
import LoginEmployeeDto from "../dto/login-employee.dto";
import UpdateEmployeeDto from "../dto/update-employee.dto";
import Address from "../entity/address.entity";
import Employee from "../entity/employee.entity";
import HttpException from "../exception/http.exception";
import EmployeeRepository from "../repository/employee.repository";
import bcyrpt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtPayload } from "../utils/jwt.payload.type";
import DepartmentService from "./department.service";
import { departmentService } from "../route/department.route";

class EmployeeService {
    constructor(private employeeRepository: EmployeeRepository) { }

    getAllEmployees(): Promise<Employee[]> {
        return this.employeeRepository.findAllEmployees();
    }

    async getEmployeeById(id: number): Promise<Employee | null> {
        const employee = await this.employeeRepository.findEmployeeById(id);

        if (!employee) {
            throw new HttpException(404, "Employee not found");
        }

        return employee;
    }

    async createEmployee(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
        const { name, email, password, address, role, departmentId } = createEmployeeDto;
        const newEmployee = new Employee();
        newEmployee.name = name;
        newEmployee.email = email;
        newEmployee.password = await bcyrpt.hash(password, 10);;
        newEmployee.role = role;

        const department = await departmentService.getDepartmentById(departmentId);

        if (!department) {
            throw new HttpException(404, 'Department not found');
        }

        newEmployee.department = department;

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

    async updateEmployee(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<void> {
        const employee = await this.getEmployeeById(id);

        employee.name = updateEmployeeDto.name;
        employee.email = updateEmployeeDto.email;

        if (updateEmployeeDto.departmentId) {
            const department = await departmentService.getDepartmentById(updateEmployeeDto.departmentId);

            if (!department) {
                throw new HttpException(404, 'Department not found');
            }

            employee.department = department;
        }

        if (updateEmployeeDto.address) {
            employee.address.line1 = updateEmployeeDto.address.line1;
            employee.address.pincode = updateEmployeeDto.address.pincode;
        }

        this.employeeRepository.saveEmployee(employee);
    }

    async loginEmployee(loginEmployeeDto: LoginEmployeeDto) {
        const employee = await this.employeeRepository.findEmployeeByEmail(loginEmployeeDto.email);

        if (!employee) {
            throw new HttpException(401, "Incorrect username or password");
        }

        const result = await bcyrpt.compare(loginEmployeeDto.password, employee.password);

        if (!result) {
            throw new HttpException(401, "Incorrect username or password");
        }

        const payload: jwtPayload = {
            name: employee.name,
            email: employee.email,
            role: employee.role
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });

        return { token };
    }
}

export default EmployeeService;