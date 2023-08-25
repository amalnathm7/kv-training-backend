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
import DepartmentService from "./department.service";
import RoleService from "./role.service";
import Candidate from "../entity/candidate.entity";
import { EmployeeStatus } from "../utils/status.enum";
import Department from "../entity/department.entity";
import Role from "../entity/role.entity";

class EmployeeService {
    constructor(private employeeRepository: EmployeeRepository, private departmentService: DepartmentService, private roleService: RoleService) { }

    getAllEmployees(offset: number, pageLength: number): Promise<[Employee[], number]> {
        return this.employeeRepository.findAllEmployees(offset, pageLength);
    }

    getAllEmployeesEmployedFor3Months(): Promise<Employee[]> {
        return this.employeeRepository.findAllEmployeesEmployedFor3Months();
    }

    async getEmployeeById(id: string): Promise<Employee | null> {
        const employee = await this.employeeRepository.findEmployeeById(id);
        if (!employee) {
            throw new HttpException(404, "Employee not found", "NOT FOUND");
        }
        return employee;
    }

    async getEmployeeByEmail(email: string): Promise<Employee | null> {
        const employee = await this.employeeRepository.findEmployeeByEmail(email);
        if (!employee) {
            throw new HttpException(404, "Employee not found", "NOT FOUND");
        }
        return employee;
    }

    async createEmployee(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
        const { name, email, phone, password, joiningDate, experience, departmentId, address, status, roleId } = createEmployeeDto;
        const newEmployee = new Employee();
        newEmployee.name = name;
        newEmployee.email = email;
        newEmployee.phone = phone;
        newEmployee.password = await bcrypt.hash(password, 10);
        newEmployee.joiningDate = joiningDate;
        newEmployee.experience = experience;
        newEmployee.status = status;

        if (roleId) {
            const role = await this.roleService.getRole(roleId);
            newEmployee.role = role;
        }

        if (departmentId) {
            const department = await this.departmentService.getDepartmentById(departmentId);
            newEmployee.department = department;
        }

        const newAddress = new Address();
        newAddress.line1 = address.line1;
        newAddress.line2 = address.line2;
        newAddress.city = address.city;
        newAddress.state = address.state;
        newAddress.country = address.country;
        newAddress.pincode = address.pincode;
        newEmployee.address = newAddress;

        return this.employeeRepository.saveEmployee(newEmployee);
    }

    async createEmployeeFromCandidate(candidate: Candidate, department: Department, role: Role): Promise<Employee> {
        const { name, email, phone, experience, address } = candidate;
        const newEmployee = new Employee();
        newEmployee.name = name;
        newEmployee.email = email;
        newEmployee.phone = phone;
        newEmployee.password = await bcrypt.hash(email, 10);
        const currentDate = new Date();
        newEmployee.joiningDate = currentDate.toISOString();
        newEmployee.experience = experience;
        newEmployee.status = EmployeeStatus.PROBATION
        newEmployee.address = candidate.address;
        newEmployee.role = role;
        newEmployee.department = department;
        newEmployee.referredBy = candidate.referredBy;

        return this.employeeRepository.saveEmployee(newEmployee);
    }

    async deleteEmployee(id: string): Promise<void> {
        const employee = await this.getEmployeeById(id);

        this.employeeRepository.deleteEmployee(employee);
    }

    async updateEmployee(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<void> {
        const employee = await this.getEmployeeById(id);

        employee.name = updateEmployeeDto.name;
        employee.email = updateEmployeeDto.email;
        employee.phone = updateEmployeeDto.phone;
        if (updateEmployeeDto.password) {
            employee.password = await bcrypt.hash(updateEmployeeDto.password, 10);
        }
        employee.joiningDate = updateEmployeeDto.joiningDate;
        employee.experience = updateEmployeeDto.experience;
        employee.status = updateEmployeeDto.status;

        if (updateEmployeeDto.roleId) {
            const role = await this.roleService.getRole(updateEmployeeDto.roleId);
            employee.role = role;
        }

        if (updateEmployeeDto.departmentId) {
            const department = await this.departmentService.getDepartmentById(updateEmployeeDto.departmentId);
            employee.department = department;
        }

        if (updateEmployeeDto.address) {
            employee.address.line1 = updateEmployeeDto.address.line1;
            employee.address.line2 = updateEmployeeDto.address.line2;
            employee.address.city = updateEmployeeDto.address.city;
            employee.address.state = updateEmployeeDto.address.state;
            employee.address.country = updateEmployeeDto.address.country;
            employee.address.pincode = updateEmployeeDto.address.pincode;
        }

        this.employeeRepository.saveEmployee(employee);
    }

    async loginEmployee(loginEmployeeDto: LoginEmployeeDto) {
        const employee = await this.employeeRepository.findEmployeeByEmail(loginEmployeeDto.email);
        if (!employee) {
            throw new HttpException(401, "Incorrect email or password", "UNAUTHORIZED");
        }

        const result = await bcrypt.compare(loginEmployeeDto.password, employee.password);
        if (!result) {
            throw new HttpException(401, "Incorrect email or password", "UNAUTHORIZED");
        }

        const payload: jwtPayload = {
            name: employee.name,
            email: employee.email,
            role: employee.role ? employee.role.id : ""
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
        return { token };
    }
}

export default EmployeeService;
