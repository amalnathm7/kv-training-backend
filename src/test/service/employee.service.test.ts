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
import * as dotenv from "dotenv";
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

    describe('Test for getEmployeeById', () => {
        test('Test case success for getEmployeeById for employee of id 1', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith("1").mockResolvedValueOnce({ id: 1, name: "Name" });
            employeeRepository.findEmployeeById = mockFunction;
            const employee = await employeeService.getEmployeeById("1");
            expect(employee).toStrictEqual({ id: 1, name: "Name" });
        });

        test('Test case failure for getEmployeeById for employee of id 2', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith("2").mockResolvedValueOnce(null);
            employeeRepository.findEmployeeById = mockFunction;
            expect(async () => { await employeeService.getEmployeeById("2") }).rejects.toThrowError(HttpException);
        });

        test('Test case success for getAllEmployees', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith().mockResolvedValueOnce([{ id: 1, name: "Name" }]);
            employeeRepository.findAllEmployees = mockFunction;
            const employee = await employeeService.getAllEmployees();
            expect(employee).toStrictEqual([{ id: 1, name: "Name" }]);
        });

        test('Test case empty result for getAllEmployees', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith().mockResolvedValueOnce([]);
            employeeRepository.findAllEmployees = mockFunction;
            const employees = await employeeService.getAllEmployees();
            expect(employees).toStrictEqual([]);
        });

        test('Test case success for createEmployee', async () => {
            const body = {
                username: "name",
                password: "pass",
                address: {
                    addressLine1: "line 1",
                    addressLine2: "line 2",
                    city: "city",
                    state: "state",
                    pincode: "pincode"
                }
            };
            const mockFunction = jest.fn();
            when(mockFunction).mockResolvedValue({ id: 1 });
            employeeRepository.saveEmployee = mockFunction;
            const newEmployee = await employeeService.createEmployee(plainToInstance(CreateEmployeeDto, body));
            expect(newEmployee).toStrictEqual({ id: 1 });
        });

        test('Test case failure for createEmployee', async () => {
            const createEmployeeDto = plainToInstance(CreateEmployeeDto, { username: "name" });
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(createEmployeeDto).mockResolvedValueOnce([{ username: "name" }]);
            employeeRepository.saveEmployee = mockFunction;
            expect(async () => await employeeService.createEmployee(createEmployeeDto)).rejects.toThrowError();
        });

        test('Test case success for updateEmployee with id = 1', async () => {
            const body = {
                username: "name",
            };

            const mockFunction1 = jest.fn();
            when(mockFunction1).calledWith("1").mockResolvedValueOnce({ id: 1, username: "old_name" });
            employeeRepository.findEmployeeById = mockFunction1;

            const mockFunction2 = jest.fn();
            when(mockFunction2).mockResolvedValue({ id: 1, username: "name" });
            employeeRepository.saveEmployee = mockFunction2;

            expect(async () => await employeeService.updateEmployee("1", plainToInstance(UpdateEmployeeDto, body))).not.toThrowError(HttpException);
        });

        test('Test case failure for updateEmployee with id = 2', async () => {
            const body = {
                username: "name",
            };

            const mockFunction1 = jest.fn();
            when(mockFunction1).calledWith("2").mockResolvedValueOnce(null);
            employeeRepository.findEmployeeById = mockFunction1;

            const mockFunction2 = jest.fn();
            when(mockFunction2).mockResolvedValue({ id: 2, username: "name" });
            employeeRepository.saveEmployee = mockFunction2;

            expect(async () => await employeeService.updateEmployee("2", plainToInstance(UpdateEmployeeDto, body))).rejects.toThrowError(HttpException);
        });

        test('Test case success for deleteEmployee with id = 1', async () => {
            const mockFunction1 = jest.fn();
            when(mockFunction1).calledWith("1").mockResolvedValueOnce({ id: 1, username: "name" });
            employeeRepository.findEmployeeById = mockFunction1;

            const mockFunction2 = jest.fn();
            when(mockFunction2).mockResolvedValue({ id: 1, username: "name" });
            employeeRepository.deleteEmployee = mockFunction2;

            expect(async () => await employeeService.deleteEmployee("1")).not.toThrowError(HttpException);
        });

        test('Test case failure for deleteEmployee with id = 2', async () => {
            const mockFunction1 = jest.fn();
            when(mockFunction1).calledWith("2").mockResolvedValueOnce(null);
            employeeRepository.findEmployeeById = mockFunction1;

            const mockFunction2 = jest.fn();
            when(mockFunction2).mockResolvedValue({ id: 2, username: "name" });
            employeeRepository.deleteEmployee = mockFunction2;

            expect(async () => await employeeService.deleteEmployee("2")).rejects.toThrowError(HttpException);
        });

        test('Test case success for loginEmployee', async () => {
            const body = {
                username: "username",
                password: "password"
            }

            const employee = new Employee();
            employee.name = "name";
            employee.username = "username";
            employee.password = await bcrypt.hash("password", 10);

            const mockFunction = jest.fn();
            when(mockFunction).calledWith(employee.username).mockResolvedValueOnce(employee);
            employeeRepository.findEmployeeByUsername = mockFunction;

            const token = await employeeService.loginEmployee(plainToInstance(LoginEmployeeDto, body));
            expect(token).toBeDefined();
        });

        test('Test case failure for loginEmployee invalid username', async () => {
            const body = {
                username: "invalid",
                password: "password"
            }

            const employee = new Employee();
            employee.name = "name";
            employee.username = "username";
            employee.password = await bcrypt.hash("password", 10);

            const mockFunction = jest.fn();
            when(mockFunction).calledWith(employee.username).mockResolvedValueOnce(employee);
            employeeRepository.findEmployeeByUsername = mockFunction;

            expect(async () => await employeeService.loginEmployee(plainToInstance(LoginEmployeeDto, body))).rejects.toThrowError(HttpException);
        });

        test('Test case failure for loginEmployee invalid password', async () => {
            const body = {
                username: "username",
                password: "invalid"
            }

            const employee = new Employee();
            employee.name = "name";
            employee.username = "username";
            employee.password = await bcrypt.hash("password", 10);

            const mockFunction = jest.fn();
            when(mockFunction).calledWith(employee.username).mockResolvedValueOnce(employee);
            employeeRepository.findEmployeeByUsername = mockFunction;

            expect(async () => await employeeService.loginEmployee(plainToInstance(LoginEmployeeDto, body))).rejects.toThrowError(HttpException);
        });
    });
});