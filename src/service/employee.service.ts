import CreateEmployeeDto from "../dto/create-employee.dto";
import LoginEmployeeDto from "../dto/login-employee.dto";
import UpdateEmployeeDto from "../dto/update-employee.dto";
import Address from "../entity/address.entity";
import Employee from "../entity/employee.entity";
import HttpException from "../exception/http.exception";
import EmployeeRepository from "../repository/employee.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtPayload } from "../utils/jwt.payload.type";
import { departmentService } from "../route/department.route";
import { roleService } from "../route/role.route";

class EmployeeService {
    constructor(private employeeRepository: EmployeeRepository) { }

    getAllEmployees(): Promise<Employee[]> {
        return this.employeeRepository.findAllEmployees();
    }

    async getEmployeeById(id: string): Promise<Employee | null> {
        const employee = await this.employeeRepository.findEmployeeById(id);
        if (!employee) {
            throw new HttpException(404, "Employee not found", "NOT FOUND");
        }
        return employee;
    }

    async createEmployee(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
        const { name, username, password, joiningDate, experience, departmentId, address, status, roleId } = createEmployeeDto;
        const newEmployee = new Employee();
        newEmployee.name = name;
        newEmployee.username = username;
        newEmployee.password = await bcrypt.hash(password, 10);
        newEmployee.joiningDate = joiningDate;
        newEmployee.experience = experience;
        newEmployee.status = status;
        
        if (roleId) {
            const role = await roleService.getRole(roleId);
            newEmployee.role = role;
        }

        if (departmentId) {
            const department = await departmentService.getDepartmentById(departmentId);
            if (!department) {
                throw new HttpException(404, 'Department not found', "NOT FOUND");
            }
            newEmployee.department = department;
        }

        const newAddress = new Address();
        newAddress.addressLine1 = address.addressLine1;
        newAddress.addressLine2 = address.addressLine2;
        newAddress.city = address.city;
        newAddress.state = address.state;
        newAddress.country = address.country;
        newAddress.pincode = address.pincode;
        newEmployee.address = newAddress;

        return this.employeeRepository.saveEmployee(newEmployee);
    }

    async deleteEmployee(id: string): Promise<void> {
        const employee = await this.getEmployeeById(id);

        this.employeeRepository.deleteEmployee(employee);
    }

    async updateEmployee(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<void> {
        const employee = await this.getEmployeeById(id);

        employee.name = updateEmployeeDto.name;
        employee.username = updateEmployeeDto.username;
        if (updateEmployeeDto.password) {
            employee.password = await bcrypt.hash(updateEmployeeDto.password, 10);
        }
        employee.joiningDate = updateEmployeeDto.joiningDate;
        employee.experience = updateEmployeeDto.experience;
        employee.status = updateEmployeeDto.status;

        if (updateEmployeeDto.roleId) {
            const role = await roleService.getRole(updateEmployeeDto.roleId);
            employee.role = role;
        }

        if (updateEmployeeDto.departmentId) {
            const department = await departmentService.getDepartmentById(updateEmployeeDto.departmentId);
            if (!department) {
                throw new HttpException(404, 'Department not found', "NOT FOUND");
            }
            employee.department = department;
        }

        if (updateEmployeeDto.address) {
            employee.address.addressLine1 = updateEmployeeDto.address.addressLine1;
            employee.address.addressLine2 = updateEmployeeDto.address.addressLine2;
            employee.address.city = updateEmployeeDto.address.city;
            employee.address.state = updateEmployeeDto.address.state;
            employee.address.country = updateEmployeeDto.address.country;
            employee.address.pincode = updateEmployeeDto.address.pincode;
        }

        this.employeeRepository.saveEmployee(employee);
    }

    async loginEmployee(loginEmployeeDto: LoginEmployeeDto) {
        const employee = await this.employeeRepository.findEmployeeByUsername(loginEmployeeDto.username);
        if (!employee) {
            throw new HttpException(401, "Incorrect username or password", "UNAUTHORIZED");
        }

        const result = await bcrypt.compare(loginEmployeeDto.password, employee.password);
        if (!result) {
            throw new HttpException(401, "Incorrect username or password", "UNAUTHORIZED");
        }

        const payload: jwtPayload = {
            name: employee.name,
            username: employee.username,
            role: employee.role ? employee.role.id : ""
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
        return { token };
    }
}

export default EmployeeService;