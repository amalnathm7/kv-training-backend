import Address from "../entity/address.entity";
import HttpException from "../exception/http.exception";
import RoleService from "./role.service";
import Candidate from "../entity/candidate.entity";
import OpeningService from "../service/opening.service";
import { CandidateStatus } from "../utils/status.enum";
import { compareDateMonts } from "../utils/date.util";
import CreateApplicationDto from "../dto/create-application.dto";
import CandidateRepository from "../repository/candidate.repository";
import { FindOptionsWhere, ILike } from "typeorm";
import UpdateApplicationDto from "../dto/update-application.dto";
import UpdateOpeningDto from "../dto/update-opening.dto";

class ApplicationService {
    constructor(
        private candidateRepository: CandidateRepository,
        private openingService: OpeningService,
        private roleService: RoleService
    ) { }

    getAllApplications(offset: number, pageLength: number, email: string, role: string, openingId: string): Promise<[Candidate[], number]> {
        const whereClause: FindOptionsWhere<Candidate> = {
            email: ILike(`%${email}%`),
            role: {
                role: ILike(`%${role}%`)
            },
            opening: {
                id: openingId || null
            }
        }
        return this.candidateRepository.findAllApplications(offset, pageLength, whereClause);
    }


    async getApplicationById(id: string): Promise<Candidate | null> {
        const application = await this.candidateRepository.findApplicationById(id);
        if (!application) {
            throw new HttpException(404, "Application not found", "NOT FOUND");
        }
        return application;
    }

    async createApplication(createApplicationDto: CreateApplicationDto): Promise<Candidate> {
        const { name, email, experience, address, roleId, phone, openingId, resume } = createApplicationDto;

        const applications = await this.candidateRepository.findApplicationsByEmail(email)
        const applicatoinsWithSameRole = applications.filter((application) => application.role.id === roleId);
        let currentDate = new Date();
        applicatoinsWithSameRole.forEach((candidate) => {
            const isLessThan6Months = !compareDateMonts(currentDate, candidate.createdAt, 6);
            if (isLessThan6Months) {
                throw new HttpException(409, "Cannot create an application for the same role for the same person within 6 months", "NOT CREATED")
            }
        });

        const newApplication = new Candidate();
        newApplication.name = name;
        newApplication.email = email;
        newApplication.experience = experience;
        newApplication.status = CandidateStatus.RECEIVED;
        newApplication.phone = phone;
        newApplication.resume = resume;

        const role = await this.roleService.getRole(roleId);
        newApplication.role = role;

        const opening = await this.openingService.getOpeningById(openingId);
        newApplication.opening = opening;

        const newAddress = new Address();
        newAddress.line1 = address.line1;
        newAddress.line2 = address.line2;
        newAddress.city = address.city;
        newAddress.state = address.state;
        newAddress.country = address.country;
        newAddress.pincode = address.pincode;
        newApplication.address = newAddress;

        return this.candidateRepository.saveCandidate(newApplication);
    }

    async deleteApplication(id: string): Promise<void> {
        const application = await this.getApplicationById(id);

        this.candidateRepository.deleteCandidate(application);
    }

    async updateApplication(id: string, updateReferralDto: UpdateApplicationDto): Promise<void> {
        const application = await this.getApplicationById(id);

        application.name = updateReferralDto.name;
        application.email = updateReferralDto.email;
        application.experience = updateReferralDto.experience;
        application.phone = updateReferralDto.phone;

        const openingId = updateReferralDto.openingId ? updateReferralDto.openingId : application.opening.id;
        const opening = await this.openingService.getOpeningById(openingId);
        if (updateReferralDto.openingId) {
            application.opening = opening;
        }

        if (application.status !== CandidateStatus.HIRED && updateReferralDto.status === CandidateStatus.HIRED) {
            if (opening.count <= 0) {
                throw new HttpException(403, "No more openings available for this position", "Forbidden");
            }
            const openingUpdateDto: UpdateOpeningDto = {...opening, departmentId: opening.department.id, roleId: opening.role.id}

            openingUpdateDto.count--;

            await this.openingService.updateOpening(opening.id, openingUpdateDto);
        }
        application.status = updateReferralDto.status;

        if (updateReferralDto.roleId) {
            const role = await this.roleService.getRole(updateReferralDto.roleId);
            application.role = role;
        }

        if (updateReferralDto.address) {
            application.address.line1 = updateReferralDto.address.line1;
            application.address.line2 = updateReferralDto.address.line2;
            application.address.city = updateReferralDto.address.city;
            application.address.state = updateReferralDto.address.state;
            application.address.country = updateReferralDto.address.country;
            application.address.pincode = updateReferralDto.address.pincode;
        }

        this.candidateRepository.saveCandidate(application);
    }
}

export default ApplicationService;

