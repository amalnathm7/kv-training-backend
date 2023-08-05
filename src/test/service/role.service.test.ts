import { DataSource } from "typeorm";
import RoleRepository from "../../repository/role.repository";
import RoleService from "../../service/role.service";
import Role from "../../entity/role.entity";
import HttpException from "../../exception/http.exception";
import { when } from "jest-when";
import { plainToInstance } from "class-transformer";
import CreateRoleDto from "../../dto/create-role.dto";
import UpdateRoleDto from "../../dto/update-role.dto";

describe('Role Service Test', () => {
    let roleService: RoleService;
    let roleRepository: RoleRepository;

    beforeAll(() => {
        const dataSource: DataSource = {
            getRepository: jest.fn()
        } as unknown as DataSource;

        roleRepository = new RoleRepository(dataSource.getRepository(Role));
        roleService = new RoleService(roleRepository);
    });

    describe('getAllRoles', () => {
        test('Success case', async () => {
            const mockFunction = jest.fn();
            mockFunction.mockResolvedValueOnce([{ id: "1", role: "role" }]);
            roleRepository.findAllRoles = mockFunction;

            const roles = await roleService.getAllRoles();
            expect(roles).toStrictEqual([{ id: "1", role: "role" }]);
        });

        test('Empty case', async () => {
            const mockFunction = jest.fn();
            mockFunction.mockResolvedValueOnce([]);
            roleRepository.findAllRoles = mockFunction;

            const roles = await roleService.getAllRoles();
            expect(roles).toStrictEqual([]);
        });
    });

    describe('getRoleById', () => {
        test('Success case', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith("1").mockResolvedValueOnce({ id: "1", role: "role" });
            roleRepository.findRole = mockFunction;

            const role = await roleService.getRole("1");
            expect(role).toStrictEqual({ id: "1", role: "role" });
        });

        test('Failure case', async () => {
            const mockFunction = jest.fn();
            when(mockFunction).calledWith("2").mockResolvedValueOnce(null);
            roleRepository.findRole = mockFunction;

            expect(async () => await roleService.getRole("2")).rejects.toThrowError(HttpException);
        });
    });

    describe('createRole', () => {
        test('Success case', async () => {
            const mockFunction = jest.fn();
            mockFunction.mockResolvedValueOnce({ id: "1" });
            roleRepository.saveRole = mockFunction;

            const role = await roleService.createRole(plainToInstance(CreateRoleDto, {
                id: "1",
                role: "role",
            }));

            expect(role).toStrictEqual({ id: "1" });
        });
    });

    describe('updateRole', () => {
        test('Success case', async () => {
            const mockFunction1 = jest.fn();
            when(mockFunction1).calledWith("1").mockResolvedValue(new Role());
            roleRepository.findRole = mockFunction1;

            const mockFunction2 = jest.fn();
            mockFunction2.mockImplementation((role) => { });
            roleRepository.saveRole = mockFunction2;

            const updateRoleDto = plainToInstance(UpdateRoleDto, {
                id: "1",
                role: "new_role",
            });

            expect(async () => await roleService.updateRole("1", updateRoleDto)).not.toThrowError();
        });
    });

    describe('deleteRole', () => {
        test('Success case', async () => {
            const mockFunction1 = jest.fn();
            when(mockFunction1).calledWith("1").mockResolvedValue(new Role());
            roleRepository.findRole = mockFunction1;

            const mockFunction2 = jest.fn();
            mockFunction2.mockImplementation((role) => { });
            roleRepository.deleteRole = mockFunction2;

            expect(roleService.deleteRole("1")).resolves.not.toThrowError();
        });
    });
});