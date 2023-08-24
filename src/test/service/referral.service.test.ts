import { DataSource } from 'typeorm';
import CandidateRepository from '../../repository/candidate.repository';
import ReferralService from '../../service/referral.service';
import Candidate from '../../entity/candidate.entity';
import HttpException from '../../exception/http.exception';
import CreateReferralDto from '../../dto/create-referral.dto';
import { plainToInstance } from 'class-transformer';
import Role from '../../entity/role.entity';
import Employee from '../../entity/employee.entity';
import Opening from '../../entity/opening.entity';
import { employeeService } from '../../route/employee.route';
import { openingService } from '../../route/opening.route';
import { roleService } from "../../route/role.route";
import { PermissionLevel } from '../../utils/permission.level.enum';
import UpdateReferralDto from '../../dto/update-referral.dto';
import { CandidateStatus } from '../../utils/status.enum';

describe("Referral Service Test", () => {
    let referralService: ReferralService;
    let candidateRepository: CandidateRepository;

    beforeAll(() => {
        const dataSource: DataSource = {
            getRepository: jest.fn(),
        } as unknown as DataSource;
        candidateRepository = new CandidateRepository(
            dataSource.getRepository(Candidate)
        );
        referralService = new ReferralService(
            candidateRepository,
            employeeService,
            openingService,
            roleService
        );
    });

    describe("Get All Referral", () => {
        test("Success case Without Opening ID", async () => {
            const mockFunction = jest.fn();
            mockFunction.mockResolvedValueOnce([{ id: 1 }]);
            candidateRepository.findAllReferrals = mockFunction;
            const referral = await referralService.getAllReferrals(0, 10, "email", "role", CandidateStatus.RECEIVED, '');
            expect(referral).toStrictEqual([{ id: 1 }]);
        });
        test("Success case With Opening ID", async () => {
            const mockFunction = jest.fn();
            mockFunction.mockResolvedValueOnce([{ id: 1 }]);
            candidateRepository.findAllReferrals = mockFunction;
            const referral = await referralService.getAllReferrals(0, 10, "email", "role", CandidateStatus.RECEIVED, '1');
            expect(referral).toStrictEqual([{ id: 1 }]);
        });
    })

    describe("Get Referral By ID", () => {
        test("Success case", async () => {
            const mockFunction = jest.fn();
            mockFunction.mockResolvedValueOnce({ id: 1 });
            candidateRepository.findReferralById = mockFunction;
            const referral = await referralService.getReferralById("1");
            expect(referral).toStrictEqual({ id: 1 });
        });
        test("Failure case", async () => {
            const mockFunction = jest.fn();
            mockFunction.mockResolvedValueOnce(null);
            candidateRepository.findReferralById = mockFunction;
            expect(async () => await referralService.getReferralById("1")).rejects.toThrowError(HttpException);
        });
    });

    describe("Get Referral By Email", () => {
        test("Success case", async () => {
            const mockFunction = jest.fn();
            mockFunction.mockResolvedValueOnce({ email: "email" });
            candidateRepository.findReferralsByEmail = mockFunction;
            const referral = await referralService.getReferralsByEmail("email");
            expect(referral).toStrictEqual({ email: "email" });
        });
        test("Failure case", async () => {
            const mockFunction = jest.fn();
            mockFunction.mockResolvedValueOnce(null);
            candidateRepository.findReferralsByEmail = mockFunction;
            expect(async () => await referralService.getReferralsByEmail("email")).rejects.toThrowError(HttpException);
        });
    });

    describe("Get Referrals Referred By Email", () => {
        test("Success case", async () => {
            const mockFunction = jest.fn();
            mockFunction.mockResolvedValueOnce({ email: "email" });
            candidateRepository.findReferralsReferredByEmail = mockFunction;
            const referral = await referralService.getReferralsReferredByEmail("email");
            expect(referral).toStrictEqual({ email: "email" });
        });
        test("Failure case", async () => {
            const mockFunction = jest.fn();
            mockFunction.mockResolvedValueOnce(null);
            candidateRepository.findReferralsReferredByEmail = mockFunction;
            expect(async () => await referralService.getReferralsReferredByEmail("email")).rejects.toThrowError(HttpException);
        });
    });

    describe("Create Referral", () => {
        test("Success case", async () => {
            const mockFunction1 = jest.fn();
            mockFunction1.mockResolvedValueOnce({ id: 1 });
            candidateRepository.saveCandidate = mockFunction1;

            const mockFunction2 = jest.fn();
            mockFunction2.mockResolvedValueOnce(new Role());
            roleService.getRole = mockFunction2;

            const mockFunction3 = jest.fn();
            mockFunction3.mockResolvedValueOnce(new Employee());
            employeeService.getEmployeeById = mockFunction3;

            const mockFunction4 = jest.fn();
            mockFunction4.mockResolvedValueOnce(new Opening());
            openingService.getOpeningById = mockFunction4

            const currentDate = new Date();
            const date12MonthsAgo = new Date();
            date12MonthsAgo.setMonth(currentDate.getMonth() - 12);
            const mockFunction5 = jest.fn();
            mockFunction5.mockResolvedValueOnce([
                { role: { id: "2" }, createdAt: currentDate },
                { role: { id: "3" }, createdAt: currentDate },
                { role: { id: "1" }, createdAt: date12MonthsAgo },
                { role: { id: "1" }, createdAt: date12MonthsAgo }
            ]);

            candidateRepository.findReferralsByEmail = mockFunction5;
            const createReferralDto = plainToInstance(CreateReferralDto, {
                name: "name",
                email: "email",
                experience: 1,
                phone: "phone",
                resume: "resume",
                referredById: "1",
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
            const referral = await referralService.createReferral(createReferralDto);
            expect(referral).toStrictEqual({ id: 1 })
        });

        test("Failure case: Referral within six months", () => {
            const mockFunction1 = jest.fn();
            mockFunction1.mockResolvedValueOnce({ id: 1 });
            candidateRepository.saveCandidate = mockFunction1;

            const mockFunction2 = jest.fn();
            mockFunction2.mockResolvedValueOnce(new Role());
            roleService.getRole = mockFunction2;

            const mockFunction3 = jest.fn();
            mockFunction3.mockResolvedValueOnce(new Employee());
            employeeService.getEmployeeById = mockFunction3;

            const mockFunction4 = jest.fn();
            mockFunction4.mockResolvedValueOnce(new Opening());
            openingService.getOpeningById = mockFunction4

            const currentDate = new Date();
            const date12MonthsAgo = new Date();
            date12MonthsAgo.setMonth(currentDate.getMonth() - 12);
            const mockFunction5 = jest.fn();
            mockFunction5.mockResolvedValueOnce([
                { role: { id: "2" }, createdAt: currentDate },
                { role: { id: "3" }, createdAt: currentDate },
                { role: { id: "1" }, createdAt: date12MonthsAgo },
                { role: { id: "1" }, createdAt: currentDate },
                { role: { id: "1" }, createdAt: date12MonthsAgo }
            ]);
            candidateRepository.findReferralsByEmail = mockFunction5;

            const createReferralDto = plainToInstance(CreateReferralDto, {
                name: "name",
                email: "email",
                experience: 1,
                phone: "phone",
                resume: "resume",
                referredById: "1",
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
            expect(async () => await referralService.createReferral(createReferralDto)).rejects.toThrowError(HttpException);
        });
    });

    describe('deleteOpening', () => {
        test('Success case', async () => {
            const mockFunction1 = jest.fn();
            mockFunction1.mockResolvedValueOnce({ status: CandidateStatus.RECEIVED, referredBy: { email: "email" } });
            referralService.getReferralById = mockFunction1;

            const mockFunction2 = jest.fn();
            mockFunction2.mockResolvedValueOnce({ permissionLevel: PermissionLevel.BASIC });
            roleService.getRole = mockFunction2;

            const mockFunction3 = jest.fn();
            mockFunction3.mockImplementation((referral) => { });
            candidateRepository.deleteCandidate = mockFunction3;

            expect(referralService.deleteReferral("1", "1", "email")).resolves.not.toThrowError();
        });

        test('Failure case: Unauthorized action', async () => {
            const mockFunction1 = jest.fn();
            mockFunction1.mockResolvedValueOnce({ status: CandidateStatus.RECEIVED, referredBy: { email: "wrongmail" } });
            referralService.getReferralById = mockFunction1;

            const mockFunction2 = jest.fn();
            mockFunction2.mockResolvedValueOnce({ permissionLevel: PermissionLevel.BASIC });
            roleService.getRole = mockFunction2;

            const mockFunction3 = jest.fn();
            mockFunction3.mockImplementation((referral) => { });
            candidateRepository.deleteCandidate = mockFunction3;

            expect(referralService.deleteReferral("1", "1", "email")).rejects.toThrowError(HttpException);
        });

        test('Failure case: Candidate moved to further stages', async () => {
            const mockFunction1 = jest.fn();
            mockFunction1.mockResolvedValueOnce({ status: CandidateStatus.ROUND_1, referredBy: { email: "email" } });
            referralService.getReferralById = mockFunction1;

            const mockFunction2 = jest.fn();
            mockFunction2.mockResolvedValueOnce({ permissionLevel: PermissionLevel.BASIC });
            roleService.getRole = mockFunction2;

            const mockFunction3 = jest.fn();
            mockFunction3.mockImplementation((referral) => { });
            candidateRepository.deleteCandidate = mockFunction3;

            expect(referralService.deleteReferral("1", "1", "email")).rejects.toThrowError(HttpException);
        });
    });

    describe("Update Referral", () => {
        test("Success case", async () => {
            const mockFunction1 = jest.fn();
            mockFunction1.mockResolvedValueOnce({
                referredBy: { email: "email" },
                address: {
                    addressLine1: "line 1",
                    addressLine2: "line 2",
                    city: "city",
                    state: "state",
                    pincode: "pincode"
                },
            });
            referralService.getReferralById = mockFunction1;

            const mockFunction2 = jest.fn();
            mockFunction2.mockResolvedValueOnce({ permissionLevel: PermissionLevel.SUPER });
            roleService.getRole = mockFunction2;

            const mockFunction3 = jest.fn();
            mockFunction3.mockResolvedValueOnce(new Employee())
            employeeService.getEmployeeById = mockFunction3;

            const mockFunction4 = jest.fn();
            mockFunction4.mockResolvedValueOnce(new Opening())
            openingService.getOpeningById = mockFunction4;

            const mockFunction5 = jest.fn();
            mockFunction5.mockResolvedValueOnce({ id: "1" })
            candidateRepository.saveCandidate = mockFunction5;

            const updateReferralDto = plainToInstance(UpdateReferralDto, {
                name: "name",
                email: "email",
                experience: 1,
                phone: "phone",
                resume: "resume",
                status: "status",
                referredById: "1",
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
            expect(async () => await referralService.updateReferral("1", "1", "email", updateReferralDto)).not.toThrowError();
        });

        test("Success case without opening ID given", async () => {
            const mockFunction1 = jest.fn();
            mockFunction1.mockResolvedValueOnce({
                referredBy: { email: "email" },
                opening: {
                    openingId: "1"
                },
                address: {
                    addressLine1: "line 1",
                    addressLine2: "line 2",
                    city: "city",
                    state: "state",
                    pincode: "pincode"
                },
            });
            referralService.getReferralById = mockFunction1;

            const mockFunction2 = jest.fn();
            mockFunction2.mockResolvedValueOnce({ permissionLevel: PermissionLevel.SUPER });
            roleService.getRole = mockFunction2;

            const mockFunction3 = jest.fn();
            mockFunction3.mockResolvedValueOnce(new Employee())
            employeeService.getEmployeeById = mockFunction3;

            const mockFunction4 = jest.fn();
            mockFunction4.mockResolvedValueOnce(new Opening())
            openingService.getOpeningById = mockFunction4;

            const mockFunction5 = jest.fn();
            mockFunction5.mockResolvedValueOnce({ id: "1" })
            candidateRepository.saveCandidate = mockFunction5;

            const updateReferralDto = plainToInstance(UpdateReferralDto, {
                name: "name",
                email: "email",
                experience: 1,
                phone: "phone",
                resume: "resume",
                status: "status",
                referredById: "1",
                address: {
                    addressLine1: "line 1",
                    addressLine2: "line 2",
                    city: "city",
                    state: "state",
                    pincode: "pincode"
                },
                roleId: "1"
            });
            expect(async () => await referralService.updateReferral("1", "1", "email", updateReferralDto)).not.toThrowError();
        });

        test("Success case with HIRED status", async () => {
            const mockFunction1 = jest.fn();
            mockFunction1.mockResolvedValueOnce({
                referredBy: { email: "email" },
                address: {
                    addressLine1: "line 1",
                    addressLine2: "line 2",
                    city: "city",
                    state: "state",
                    pincode: "pincode"
                },
            });
            referralService.getReferralById = mockFunction1;

            const mockFunction2 = jest.fn();
            mockFunction2.mockResolvedValueOnce({ permissionLevel: PermissionLevel.SUPER });
            roleService.getRole = mockFunction2;

            const mockFunction3 = jest.fn();
            mockFunction3.mockResolvedValueOnce(new Employee())
            employeeService.getEmployeeById = mockFunction3;

            const mockFunction4 = jest.fn();
            mockFunction4.mockResolvedValueOnce({ id: "1", count: 3, department: { id: "1" }, role: { id: "1" } })
            openingService.getOpeningById = mockFunction4;

            const mockFunction5 = jest.fn();
            mockFunction5.mockResolvedValueOnce({ id: "1" })
            candidateRepository.saveCandidate = mockFunction5;

            const mockFunction6 = jest.fn();
            mockFunction6.mockResolvedValueOnce({})
            openingService.updateOpening = mockFunction6;

            const updateReferralDto = plainToInstance(UpdateReferralDto, {
                name: "name",
                email: "email",
                experience: 1,
                phone: "phone",
                resume: "resume",
                status: "Hired",
                referredById: "1",
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
            expect(async () => await referralService.updateReferral("1", "1", "email", updateReferralDto)).not.toThrowError();
        });

        test("Failure case with HIRED status and opening.count as 0", async () => {
            const mockFunction1 = jest.fn();
            mockFunction1.mockResolvedValueOnce({
                referredBy: { email: "email" },
                status: 'Recieved',
                address: {
                    addressLine1: "line 1",
                    addressLine2: "line 2",
                    city: "city",
                    state: "state",
                    pincode: "pincode"
                },
            });
            referralService.getReferralById = mockFunction1;

            const mockFunction2 = jest.fn();
            mockFunction2.mockResolvedValueOnce({ permissionLevel: PermissionLevel.SUPER });
            roleService.getRole = mockFunction2;

            const mockFunction3 = jest.fn();
            mockFunction3.mockResolvedValueOnce(new Employee())
            employeeService.getEmployeeById = mockFunction3;

            const mockFunction4 = jest.fn();
            mockFunction4.mockResolvedValueOnce({ id: "1", count: 0, department: { id: "1" }, role: { id: "1" } })
            openingService.getOpeningById = mockFunction4;

            const mockFunction5 = jest.fn();
            mockFunction5.mockResolvedValueOnce({ id: "1" })
            candidateRepository.saveCandidate = mockFunction5;

            const mockFunction6 = jest.fn();
            mockFunction6.mockResolvedValueOnce({})
            openingService.updateOpening = mockFunction6;

            const updateReferralDto = plainToInstance(UpdateReferralDto, {
                name: "name",
                email: "email",
                experience: 1,
                phone: "phone",
                resume: "resume",
                status: "Hired",
                referredById: "1",
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
            expect(async () => await referralService.updateReferral("1", "1", "email", updateReferralDto)).rejects.toThrowError(HttpException);
        });

        test("Failure case", async () => {
            const mockFunction1 = jest.fn();
            mockFunction1.mockResolvedValueOnce({ referredBy: { email: "wrongmail" } });
            referralService.getReferralById = mockFunction1;

            const mockFunction2 = jest.fn();
            mockFunction2.mockResolvedValueOnce({ permissionLevel: PermissionLevel.BASIC });
            roleService.getRole = mockFunction2;

            const mockFunction3 = jest.fn();
            mockFunction3.mockResolvedValueOnce(new Employee())
            employeeService.getEmployeeById = mockFunction3;

            const mockFunction4 = jest.fn();
            mockFunction4.mockResolvedValueOnce(new Opening())
            openingService.getOpeningById = mockFunction4;

            const mockFunction5 = jest.fn();
            mockFunction5.mockResolvedValueOnce({ id: "1" })
            candidateRepository.saveCandidate = mockFunction5;

            const updateReferralDto = plainToInstance(UpdateReferralDto, {
                name: "name",
                email: "email",
                experience: 1,
                phone: "phone",
                resume: "resume",
                status: "status",
                referredById: "1",
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
            expect(async () => await referralService.updateReferral("1", "1", "email", updateReferralDto)).rejects.toThrowError(HttpException);
        });
    });
});
