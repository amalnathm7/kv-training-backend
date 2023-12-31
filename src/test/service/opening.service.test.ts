import { DataSource } from "typeorm";
import OpeningRepository from "../../repository/opening.repository";
import OpeningService from "../../service/opening.service";
import Opening from "../../entity/opening.entity";
import { departmentService } from "../../route/department.route";
import { roleService } from "../../route/role.route";
import HttpException from "../../exception/http.exception";
import Department from "../../entity/department.entity";
import { when } from "jest-when";
import Role from "../../entity/role.entity";
import { plainToInstance } from "class-transformer";
import CreateOpeningDto from "../../dto/create-opening.dto";
import UpdateOpeningDto from "../../dto/update-opening.dto";
import { PermissionLevel } from "../../utils/permission.level.enum";
describe("Opening Service Test", () => {
  let openingService: OpeningService;
  let openingRepository: OpeningRepository;

  beforeAll(() => {
    const dataSource: DataSource = {
      getRepository: jest.fn(),
    } as unknown as DataSource;
    openingRepository = new OpeningRepository(
      dataSource.getRepository(Opening)
    );
    openingService = new OpeningService(
      openingRepository,
      departmentService,
      roleService
    );
  });
  describe("getAllOpenings by public user", () => {
    test("Success case", async () => {
      const mockFunction = jest.fn();
      mockFunction.mockResolvedValueOnce([{ id: 1, title: "Title" }]);
      openingRepository.findAllOpenings = mockFunction;
      const opening = await openingService.getAllOpenings(0, 10);
      expect(opening).toStrictEqual([{ id: 1, title: "Title" }]);
    });
    test("Success case by non super user", async () => {
      const mockFunction = jest.fn();
      mockFunction.mockResolvedValueOnce([{ id: 1, title: "Title" }]);
      openingRepository.findAllOpenings = mockFunction;

      const mockFunction2 = jest.fn();
      const role = new Role;
      role.id = "1";
      role.permissionLevel = PermissionLevel.ADVANCED;
      mockFunction2.mockResolvedValueOnce(role)
      roleService.getRole = mockFunction2;

      const opening = await openingService.getAllOpenings(0, 10, role.id);
      expect(opening).toStrictEqual([{ id: 1, title: "Title" }]);
    });
    test("Success case by super user", async () => {
      const mockFunction = jest.fn();
      mockFunction.mockResolvedValueOnce([{ id: 1, title: "Title" }]);
      openingRepository.findAllOpenings = mockFunction;

      const mockFunction2 = jest.fn();
      const role = new Role;
      role.id = "2";
      role.permissionLevel = PermissionLevel.SUPER;
      mockFunction2.mockResolvedValueOnce(role)
      roleService.getRole = mockFunction2;

      const opening = await openingService.getAllOpenings(0, 10, role.id);
      expect(opening).toStrictEqual([{ id: 1, title: "Title" }]);
    });
    test("Empty Opening case", async () => {
      const mockFunction = jest.fn();
      mockFunction.mockResolvedValueOnce([]);
      openingRepository.findAllOpenings = mockFunction;
      const opening = await openingService.getAllOpenings(0, 10);
      expect(opening).toStrictEqual([]);
    });
  });
  describe("getOpeningById", () => {
    test("Success case", async () => {
      const mockFunction = jest.fn();
      mockFunction.mockResolvedValueOnce({ id: 1, title: "Title" });
      openingRepository.findOpeningById = mockFunction;
      const opening = await openingService.getOpeningById("1");
      expect(opening).toStrictEqual({ id: 1, title: "Title" });
    });
    test("Failure case", async () => {
      const mockFunction = jest.fn();
      mockFunction.mockResolvedValueOnce(null);
      openingRepository.findOpeningById = mockFunction;
      expect(async () => {
        await openingService.getOpeningById("1");
      }).rejects.toThrowError(HttpException);
      
    });
  });
  describe("createOpening", () => {
    test("Success Case", async () => {
        const mockFunction = jest.fn();
        mockFunction.mockResolvedValue({id: 1});
        openingRepository.saveOpening = mockFunction;
        
        const mockFunction2 = jest.fn();
        when(mockFunction2).calledWith('1').mockResolvedValueOnce(new Department())
        departmentService.getDepartmentById = mockFunction2;
        
        const mockFunction3 = jest.fn();
        mockFunction3.mockResolvedValueOnce( new Role())
        roleService.getRole = mockFunction3;

        const createOpeningDto = plainToInstance(CreateOpeningDto,{
            title:"title",
            description:"description",
            skills:"skills",
            count:2,
            location:"location",
            experience:5,
            departmentId:"1",
            roleId:"1"
        });
        const opening = await openingService.createOpening(createOpeningDto);
        expect(opening).toStrictEqual({id:1})
    });
  });
  describe("updateOpening", () => {
    test("Success Case", async () => {
        const mockFunction = jest.fn();
        mockFunction.mockResolvedValue({id: 1});
        openingRepository.saveOpening = mockFunction;

        const mockFunction4 = jest.fn();
        mockFunction4.mockResolvedValueOnce({
            title:"title",
            description:"description",
            skills:"skills",
            count:2,
            location:"location",
            experience:5,
            departmentId:"1",
            roleId:"1"
        });  
        openingRepository.findOpeningById = mockFunction4

        const mockFunction2 = jest.fn();
        when(mockFunction2).calledWith('1').mockResolvedValueOnce(new Department())
        departmentService.getDepartmentById = mockFunction2;
        
        const mockFunction3 = jest.fn();
        mockFunction3.mockResolvedValueOnce( new Role())
        roleService.getRole = mockFunction3;

        const updateOpeningDto = plainToInstance(UpdateOpeningDto,{
            title:"title",
            description:"description",
            skills:"skills",
            count:2,
            location:"location",
            experience:5,
            departmentId:"1",
            roleId:"1"
        });
        expect(async()=>{await openingService.updateOpening('1',updateOpeningDto)}).not.toThrowError(HttpException);
    });
  });
  describe('deleteOpening', () => {
    test('Success case', async () => {
        const mockFunction1 = jest.fn();
        when(mockFunction1).calledWith("1").mockResolvedValueOnce(new Opening());
        openingService.getOpeningById = mockFunction1;

        const mockFunction2 = jest.fn();
        mockFunction2.mockImplementation((opening) => { });
        openingRepository.deleteOpening = mockFunction2;

        expect(openingService.deleteOpening("1")).resolves.not.toThrowError();
    });
});
});



