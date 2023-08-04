import { DataSource } from "typeorm";
import dataSource from "../../db/postgres.db";
import EmployeeRepository from "../../repository/employee.repository";
import EmployeeService from "../../service/employee.service";
import Employee from "../../entity/employee.entity";
import { when } from "jest-when";
import HttpException from "../../exception/http.exception";

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
        test('Test case success for employee of id 1', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(1).mockResolvedValueOnce({ id: 1, name: "Name" });
            employeeRepository.findEmployeeById = mockFunction;
            const employee = await employeeService.getEmployeeById(1);
            expect(employee).toStrictEqual({ id: 1, name: "Name" });
        });

        test('Test case failure for employee of id 2', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith(2).mockResolvedValueOnce(null);
            employeeRepository.findEmployeeById = mockFunction;
            expect(async () => { await employeeService.getEmployeeById(2) }).rejects.toThrowError(HttpException);
        });

        test('Test case spy for employee of id 3', async () => {
            const spy = jest.spyOn(employeeRepository, 'findAllEmployees');
            spy.mockResolvedValueOnce([]);
            const users = await employeeService.getAllEmployees();
            expect(spy).toBeCalledTimes(1);
            expect(users).toEqual([]);
        });
    });
});