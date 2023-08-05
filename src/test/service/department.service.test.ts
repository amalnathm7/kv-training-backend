import { DataSource } from "typeorm";
import DepartmentRepository from "../../repository/department.repository";
import DepartmentService from "../../service/department.service";
import Department from "../../entity/department.entity";
import HttpException from "../../exception/http.exception";
import { when } from "jest-when";
import { plainToInstance } from "class-transformer";
import CreateDepartmentDto from "../../dto/create-department.dto";
import UpdateDepartmentDto from "../../dto/update-department.dto";

describe('Department Service Test', () => {
    let departmentService: DepartmentService;
    let departmentRepository: DepartmentRepository;

    beforeAll(() => {
        const dataSource: DataSource = {
            getRepository: jest.fn()
        } as unknown as DataSource;

        departmentRepository = new DepartmentRepository(dataSource.getRepository(Department));
        departmentService = new DepartmentService(departmentRepository);
    });

    describe('getAllDepartments', () => {
        test('Success case', async () => {
            const mockFunction = jest.fn();
            mockFunction.mockResolvedValueOnce([{ id: "1", name: "dept" }]);
            departmentRepository.findAllDepartments = mockFunction;

            const departments = await departmentService.getAllDepartments();
            expect(departments).toStrictEqual([{ id: "1", name: "dept" }]);
        });

        test('Empty case', async () => {
            const mockFunction = jest.fn();
            mockFunction.mockResolvedValueOnce([]);
            departmentRepository.findAllDepartments = mockFunction;

            const departments = await departmentService.getAllDepartments();
            expect(departments).toStrictEqual([]);
        });
    });

    describe('getDepartmentById', () => {
        test('Success case', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith("1").mockResolvedValueOnce({ id: "1", name: "dept" });
            departmentRepository.findDepartmentById = mockFunction;

            const department = await departmentService.getDepartmentById("1");
            expect(department).toStrictEqual({ id: "1", name: "dept" });
        });

        test('Failure case', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith("2").mockResolvedValueOnce(null);
            departmentRepository.findDepartmentById = mockFunction;

            expect(async () => await departmentService.getDepartmentById("2")).rejects.toThrowError(HttpException);
        });
    });

    describe('createDepartment', () => {
        test('Success case', async () => {
            const mockFunction = jest.fn();
            mockFunction.mockResolvedValueOnce({ id: "1" });
            departmentRepository.saveDepartment = mockFunction;

            const department = await departmentService.createDepartment(plainToInstance(CreateDepartmentDto, {
                id: "1",
                name: "dept",
            }));

            expect(department).toStrictEqual({ id: "1" });
        });
    });

    describe('updateDepartment', () => {
        test('Success case', async () => {
            const mockFunction1 = jest.fn();
            when(mockFunction1).calledWith("1").mockResolvedValue(new Department());
            departmentRepository.findDepartmentById = mockFunction1;

            const mockFunction2 = jest.fn();
            mockFunction2.mockImplementation((dept) => { });
            departmentRepository.saveDepartment = mockFunction2;

            const updateDepartmentDto = plainToInstance(UpdateDepartmentDto, {
                id: "1",
                name: "new_dept",
            });

            expect(async () => await departmentService.updateDepartment("1", updateDepartmentDto)).not.toThrowError();
        });
    });

    describe('deleteDepartment', () => {
        test('Success case', async () => {
            const mockFunction1 = jest.fn();
            when(mockFunction1).calledWith("1").mockResolvedValue(new Department());
            departmentRepository.findDepartmentById = mockFunction1;

            const mockFunction2 = jest.fn();
            mockFunction2.mockImplementation((dept) => { });
            departmentRepository.deleteDepartment = mockFunction2;

            expect(departmentService.deleteDepartment("1")).resolves.not.toThrowError();
        });
    });
});