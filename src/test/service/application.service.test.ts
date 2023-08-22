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

describe("Referral Service Test", () => {
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
        openingService,
        roleService
      );
    });

    describe("Get Referral By ID", () => {
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

    describe("Create Referral", () => {
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
});

