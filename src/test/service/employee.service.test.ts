import { DataSource } from "typeorm";
import EmployeeRepository from "../../repository/employee.repository";
import EmployeeService from "../../service/employee.service";
import Employee from "../../entity/employee.entity";
import { when } from "jest-when";
import HttpException from "../../exception/http.exception";
import { plainToInstance } from "class-transformer";
import CreateEmployeeDto from "../../dto/create-employee.dto";
import UpdateEmployeeDto from "../../dto/update-employee.dto";
import LoginEmployeeDto from "../../dto/login-employee.dto";
import bcrypt from "bcrypt";
import Role from "../../entity/role.entity";
import Department from "../../entity/department.entity";
import * as dotenv from "dotenv";
import { roleService } from "../../route/role.route";
import { departmentService } from "../../route/department.route";
dotenv.config({ path: __dirname + '/../../../.env' });

describe('Employee Service Test', () => {
    let employeeService: EmployeeService;
    let employeeRepository: EmployeeRepository;

    beforeAll(() => {
        const dataSource: DataSource = {
            getRepository: jest.fn()
        } as unknown as DataSource;

        employeeRepository = new EmployeeRepository(dataSource.getRepository(Employee));
        employeeService = new EmployeeService(employeeRepository);
    });

    describe('getEmployeeById', () => {
        test('Success case for employee of id 1', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith("1").mockResolvedValueOnce({ id: 1, name: "Name" });
            employeeRepository.findEmployeeById = mockFunction;
            const employee = await employeeService.getEmployeeById("1");
            expect(employee).toStrictEqual({ id: 1, name: "Name" });
        });

        test('Failure case for employee of id 2', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith("2").mockResolvedValueOnce(null);
            employeeRepository.findEmployeeById = mockFunction;
            expect(async () => { await employeeService.getEmployeeById("2") }).rejects.toThrowError(HttpException);
        });
    });

    describe('getAllEmployees', () => {
        test('Success case', async () => {
            const mockFunction = jest.fn();
            mockFunction.mockResolvedValueOnce([{ id: 1, name: "Name" }]);
            employeeRepository.findAllEmployees = mockFunction;
            const employee = await employeeService.getAllEmployees(0);
            expect(employee).toStrictEqual([{ id: 1, name: "Name" }]);
        });

        test('Empty result case', async () => {
            const mockFunction = jest.fn();
            mockFunction.mockResolvedValueOnce([]);
            employeeRepository.findAllEmployees = mockFunction;
            const employees = await employeeService.getAllEmployees(0);
            expect(employees).toStrictEqual([]);
        });
    });

    describe('createEmployee', () => {
        test('Success case', async () => {
            const mockFunction1 = jest.fn();
            mockFunction1.mockResolvedValueOnce({ id: 1 });
            employeeRepository.saveEmployee = mockFunction1;

            const mockFunction2 = jest.fn();
            when(mockFunction2).calledWith("1").mockResolvedValueOnce(new Role());
            roleService.getRole = mockFunction2;

            const mockFunction3 = jest.fn();
            when(mockFunction3).calledWith("1").mockResolvedValueOnce(new Department());
            departmentService.getDepartmentById = mockFunction3;

            const createEmployeeDto = plainToInstance(CreateEmployeeDto, {
                username: "name",
                password: "pass",
                address: {
                    addressLine1: "line 1",
                    addressLine2: "line 2",
                    city: "city",
                    state: "state",
                    pincode: "pincode"
                },
                roleId: "1",
                departmentId: "1",

            });
            const newEmployee = await employeeService.createEmployee(createEmployeeDto);
            expect(newEmployee).toStrictEqual({ id: 1 });
        });
    });

    describe('updateEmployee', () => {
        test('Success case', async () => {
            const mockFunction1 = jest.fn();
            when(mockFunction1).calledWith("1").mockResolvedValueOnce({
                id: 1,
                username: "old_name",
                password: "old_pass",
                roleId: "2",
                departmentId: "2",
                address: {
                    addressLine1: "line 1 old",
                    addressLine2: "line 2 old",
                    city: "city old",
                    state: "state old",
                    pincode: "pincode old"
                },
            });
            employeeRepository.findEmployeeById = mockFunction1;

            const mockFunction2 = jest.fn();
            when(mockFunction2).calledWith("1").mockResolvedValueOnce(new Role());
            roleService.getRole = mockFunction2;

            const mockFunction3 = jest.fn();
            when(mockFunction3).calledWith("1").mockResolvedValueOnce(new Department());
            departmentService.getDepartmentById = mockFunction3;

            const mockFunction4 = jest.fn();
            mockFunction4.mockResolvedValueOnce({ id: 1, username: "name" });
            employeeRepository.saveEmployee = mockFunction4;

            const updateEmployeeDto = plainToInstance(UpdateEmployeeDto, {
                username: "name",
                password: "pass",
                roleId: "1",
                departmentId: "1",
                address: {
                    addressLine1: "line 1",
                    addressLine2: "line 2",
                    city: "city",
                    state: "state",
                    pincode: "pincode"
                },
            });
            expect(async () => await employeeService.updateEmployee("1", updateEmployeeDto)).not.toThrowError(HttpException);
        });
    });

    describe('deleteEmployee', () => {
        test('Success case', async () => {
            const mockFunction1 = jest.fn();
            when(mockFunction1).calledWith("1").mockResolvedValueOnce(new Employee());
            employeeService.getEmployeeById = mockFunction1;

            const mockFunction2 = jest.fn();
            mockFunction2.mockImplementation((employee) => { });
            employeeRepository.deleteEmployee = mockFunction2;

            expect(employeeService.deleteEmployee("1")).resolves.not.toThrowError();
        });
    });

    describe('loginEmployee', () => {
        test('Success case with role', async () => {
            const body = {
                username: "username",
                password: "password"
            }

            const employee = new Employee();
            employee.name = "name";
            employee.username = "username";
            employee.role = new Role();
            employee.role.id = "role";
            employee.password = await bcrypt.hash("password", 10);

            const mockFunction = jest.fn();
            when(mockFunction).calledWith(body.username).mockResolvedValueOnce(employee);
            employeeRepository.findEmployeeByUsername = mockFunction;

            const token = await employeeService.loginEmployee(plainToInstance(LoginEmployeeDto, body));
            expect(token).toBeDefined();
        });

        test('Success case without role', async () => {
            const body = {
                username: "username",
                password: "password"
            }

            const employee = new Employee();
            employee.name = "name";
            employee.username = "username";
            employee.password = await bcrypt.hash("password", 10);

            const mockFunction = jest.fn();
            when(mockFunction).calledWith(body.username).mockResolvedValueOnce(employee);
            employeeRepository.findEmployeeByUsername = mockFunction;

            const token = await employeeService.loginEmployee(plainToInstance(LoginEmployeeDto, body));
            expect(token).toBeDefined();
        });

        test('Failure case for invalid username', async () => {
            const body = {
                username: "invalid",
                password: "password"
            }

            const employee = new Employee();
            employee.name = "name";
            employee.username = "username";
            employee.password = await bcrypt.hash("password", 10);

            const mockFunction = jest.fn();
            when(mockFunction).calledWith(body.username).mockResolvedValueOnce(null);
            employeeRepository.findEmployeeByUsername = mockFunction;

            await expect(async () => await employeeService.loginEmployee(plainToInstance(LoginEmployeeDto, body))).rejects.toThrowError(HttpException);
        });

        test('Failure case for invalid password', async () => {
            const body = {
                username: "username",
                password: "invalid"
            }

            const employee = new Employee();
            employee.name = "name";
            employee.username = "username";
            employee.password = await bcrypt.hash("password", 10);

            const mockFunction = jest.fn();
            when(mockFunction).calledWith(body.username).mockResolvedValueOnce(employee);
            employeeRepository.findEmployeeByUsername = mockFunction;

            await expect(async () => await employeeService.loginEmployee(plainToInstance(LoginEmployeeDto, body))).rejects.toThrowError(HttpException);
        });
    });
});