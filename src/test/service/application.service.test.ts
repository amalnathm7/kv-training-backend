import { DataSource } from 'typeorm';
import CandidateRepository from '../../repository/candidate.repository';
import ApplicationService from '../../service/application.service'
import Candidate from '../../entity/candidate.entity';
import HttpException from '../../exception/http.exception';
import CreateReferralDto from '../../dto/create-referral.dto';
import { plainToInstance } from 'class-transformer';
import Role from '../../entity/role.entity';
import Opening from '../../entity/opening.entity';
import {openingService} from '../../route/opening.route';
import { roleService } from "../../route/role.route";
import { CandidateStatus } from '../../utils/status.enum';
import { PermissionLevel } from '../../utils/permission.level.enum';
import UpdateApplicationDto from '../../dto/update-application.dto';
import { employeeService } from '../../route/employee.route';
import Employee from '../../entity/employee.entity';

describe("Application Service Test", () => {
    let applicationService: ApplicationService;
    let candidateRepository: CandidateRepository;

    beforeAll(() => {
      const dataSource: DataSource = {
        getRepository: jest.fn(),
      } as unknown as DataSource;
      candidateRepository = new CandidateRepository(
        dataSource.getRepository(Candidate)
      );
      applicationService = new ApplicationService(
        candidateRepository,
        employeeService,
        openingService,
        roleService
      );
    });

    describe("Get All Applications",() => {
        test("Success case Without Opening ID", async() => {
            const mockFunction = jest.fn();
            mockFunction.mockResolvedValueOnce([ {id:1} ]);
            candidateRepository.findAllApplications = mockFunction;
            const referral = await applicationService.getAllApplications(0, 10, "email", "role", "");
            expect(referral).toStrictEqual([ {id:1} ]);
        });
        test("Success case With Opening ID", async() => {
            const mockFunction = jest.fn();
            mockFunction.mockResolvedValueOnce([ {id:1} ]);
            candidateRepository.findAllApplications = mockFunction;
            const referral = await applicationService.getAllApplications(0, 10, "email", "role", "");
            expect(referral).toStrictEqual([ {id:1} ]);
        });
    })

    describe("Application Referral By ID", () => {
        test("Success case", async() => {
            const mockFunction = jest.fn();
            mockFunction.mockResolvedValueOnce({ id: 1 });
            candidateRepository.findApplicationById = mockFunction;
            const referral = await applicationService.getApplicationById("1");
            expect(referral).toStrictEqual({ id: 1 });
        });
        test("Failure case", async() => {
            const mockFunction = jest.fn();
            mockFunction.mockResolvedValueOnce(null);
            candidateRepository.findApplicationById = mockFunction;
            expect(async() => await applicationService.getApplicationById("1")).rejects.toThrowError(HttpException);
        });
    });

    describe("Create Application", () => {
        test("Success case", async() => {
            const mockFunction1 = jest.fn();
            mockFunction1.mockResolvedValueOnce({id: 1});
            candidateRepository.saveCandidate = mockFunction1;

            const mockFunction2 = jest.fn();
            mockFunction2.mockResolvedValueOnce(new Role());
            roleService.getRole = mockFunction2;

            const mockFunction4 = jest.fn();
            mockFunction4.mockResolvedValueOnce(new Opening());
            openingService.getOpeningById = mockFunction4

            const currentDate = new Date();
            const date12MonthsAgo = new Date();
            date12MonthsAgo.setMonth(currentDate.getMonth() - 12);
            const mockFunction5 = jest.fn();
            mockFunction5.mockResolvedValueOnce([
                {role: {id: "2"}, createdAt: currentDate},
                {role: {id: "3"}, createdAt: currentDate},
                {role: {id: "1"}, createdAt: date12MonthsAgo},
                {role: {id: "1"}, createdAt: date12MonthsAgo}
            ]);

            candidateRepository.findApplicationsByEmail = mockFunction5;
            const createReferralDto = plainToInstance(CreateReferralDto,{
                name: "name",
                email: "email",
                experience: 1,
                phone: "phone",
                resume: "resume",
                address: {
                    addressLine1: "line 1",
                    addressLine2: "line 2",
                    city: "city",
                    state: "state",
                    pincode: "pincode"
                },
                roleId: "1",
                openingId: "1",
            });
            const referral = await applicationService.createApplication(createReferralDto);
            expect(referral).toStrictEqual({id:1})
        });

        test("Failure case: Referral within six months", () => {
            const mockFunction1 = jest.fn();
            mockFunction1.mockResolvedValueOnce({id: 1});
            candidateRepository.saveCandidate = mockFunction1;

            const mockFunction2 = jest.fn();
            mockFunction2.mockResolvedValueOnce(new Role());
            roleService.getRole = mockFunction2;

            const mockFunction4 = jest.fn();
            mockFunction4.mockResolvedValueOnce(new Opening());
            openingService.getOpeningById = mockFunction4

            const currentDate = new Date();
            const date12MonthsAgo = new Date();
            date12MonthsAgo.setMonth(currentDate.getMonth() - 12);
            const mockFunction5 = jest.fn();
            mockFunction5.mockResolvedValueOnce([
                {role: {id: "2"}, createdAt: currentDate},
                {role: {id: "3"}, createdAt: currentDate},
                {role: {id: "1"}, createdAt: date12MonthsAgo},
                {role: {id: "1"}, createdAt: currentDate},
                {role: {id: "1"}, createdAt: date12MonthsAgo}
            ]);
            candidateRepository.findApplicationsByEmail = mockFunction5;

            const createReferralDto = plainToInstance(CreateReferralDto,{
                name: "name",
                email: "email",
                experience: 1,
                phone: "phone",
                resume: "resume",
                address: {
                    addressLine1: "line 1",
                    addressLine2: "line 2",
                    city: "city",
                    state: "state",
                    pincode: "pincode"
                },
                roleId: "1",
                openingId: "1",
            });
            expect(async() => await applicationService.createApplication(createReferralDto)).rejects.toThrowError(HttpException);
        });
    });

    describe('deleteApplication', () => {
        test('Success case', async () => {
            const mockFunction1 = jest.fn();
            mockFunction1.mockResolvedValueOnce({ status: CandidateStatus.RECEIVED });
            applicationService.getApplicationById = mockFunction1;

            const mockFunction3 = jest.fn();
            mockFunction3.mockImplementation((application) => { });
            candidateRepository.deleteCandidate = mockFunction3;

            expect(applicationService.deleteApplication("1")).resolves.not.toThrowError();
        });
    });

    describe("Update Application", () => {
        test("Success case", async() => {
            const mockFunction1 = jest.fn();
            mockFunction1.mockResolvedValueOnce({
                    address: {
                        addressLine1: "line 1",
                        addressLine2: "line 2",
                        city: "city",
                        state: "state",
                        pincode: "pincode"
                    },
                });
            applicationService.getApplicationById = mockFunction1;
    
            const mockFunction2 = jest.fn();
            mockFunction2.mockResolvedValueOnce({permissionLevel: PermissionLevel.SUPER});
            roleService.getRole = mockFunction2;
    
            const mockFunction4 = jest.fn();
            mockFunction4.mockResolvedValueOnce(new Opening())
            openingService.getOpeningById = mockFunction4;
    
            const mockFunction5 = jest.fn();
            mockFunction5.mockResolvedValueOnce({id: "1"})
            candidateRepository.saveCandidate = mockFunction5;
    
            const updateApplicationDto = plainToInstance(UpdateApplicationDto, {
                name: "name",
                email: "email",
                experience: 1,
                phone: "phone",
                resume: "resume",
                status: "status",
                address: {
                    addressLine1: "line 1",
                    addressLine2: "line 2",
                    city: "city",
                    state: "state",
                    pincode: "pincode"
                },
                roleId: "1",
                openingId: "1",
            });
            expect(async() => await applicationService.updateApplication("1", updateApplicationDto)).not.toThrowError();
        });
    
        test("Success case with HIRED status", async() => {
            const mockFunction1 = jest.fn();
            mockFunction1.mockResolvedValueOnce({
                    address: {
                        addressLine1: "line 1",
                        addressLine2: "line 2",
                        city: "city",
                        state: "state",
                        pincode: "pincode"
                    },
                });
            applicationService.getApplicationById = mockFunction1;
    
            const mockFunction2 = jest.fn();
            mockFunction2.mockResolvedValueOnce({permissionLevel: PermissionLevel.SUPER});
            roleService.getRole = mockFunction2;
   
            const mockFunction4 = jest.fn();
            mockFunction4.mockResolvedValueOnce({id: "1", count: 3, department: { id: "1" }, role: { id: "1" }})
            openingService.getOpeningById = mockFunction4;
    
            const mockFunction5 = jest.fn();
            mockFunction5.mockResolvedValueOnce({id: "1"})
            candidateRepository.saveCandidate = mockFunction5;
    
            const mockFunction6 = jest.fn();
            mockFunction6.mockResolvedValueOnce({})
            openingService.updateOpening = mockFunction6;
    
            const mockFunction7 = jest.fn();
            mockFunction7.mockResolvedValueOnce(new Employee())
            employeeService.createEmployeeFromCandidate = mockFunction7;

            const updateApplicationDto = plainToInstance(UpdateApplicationDto,{
                name: "name",
                email: "email",
                experience: 1,
                phone: "phone",
                resume: "resume",
                status: "Hired",
                address: {
                    addressLine1: "line 1",
                    addressLine2: "line 2",
                    city: "city",
                    state: "state",
                    pincode: "pincode"
                },
                roleId: "1",
                openingId: "1",
            });
            expect(async() => await applicationService.updateApplication("1", updateApplicationDto)).not.toThrow();
        });
    
        test("Failure case with HIRED status and opening.count as 0", async() => {
            const mockFunction1 = jest.fn();
            mockFunction1.mockResolvedValueOnce({
                    status: 'Recieved',
                    address: {
                        addressLine1: "line 1",
                        addressLine2: "line 2",
                        city: "city",
                        state: "state",
                        pincode: "pincode"
                    },
                });
            applicationService.getApplicationById = mockFunction1;
    
            const mockFunction2 = jest.fn();
            mockFunction2.mockResolvedValueOnce({permissionLevel: PermissionLevel.SUPER});
            roleService.getRole = mockFunction2;
    
            const mockFunction4 = jest.fn();
            mockFunction4.mockResolvedValueOnce({id: "1", count: 0, department: { id: "1" }, role: { id: "1" }})
            openingService.getOpeningById = mockFunction4;
    
            const mockFunction5 = jest.fn();
            mockFunction5.mockResolvedValueOnce({id: "1"})
            candidateRepository.saveCandidate = mockFunction5;
    
            const mockFunction6 = jest.fn();
            mockFunction6.mockResolvedValueOnce({})
            openingService.updateOpening = mockFunction6;
    
            const updateApplicationDto = plainToInstance(UpdateApplicationDto,{
                name: "name",
                email: "email",
                experience: 1,
                phone: "phone",
                resume: "resume",
                status: "Hired",
                address: {
                    addressLine1: "line 1",
                    addressLine2: "line 2",
                    city: "city",
                    state: "state",
                    pincode: "pincode"
                },
                roleId: "1",
                openingId: "1",
            });
            expect(async() => await applicationService.updateApplication("1", updateApplicationDto)).rejects.toThrowError(HttpException);
        });
    });
});
