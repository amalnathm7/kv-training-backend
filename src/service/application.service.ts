import Address from "../entity/address.entity";
import HttpException from "../exception/http.exception";
import RoleService from "./role.service";
import Candidate from "../entity/candidate.entity";
import OpeningService from "../service/opening.service";
import { CandidateStatus } from "../utils/status.enum";
import { compareDateMonts } from "../utils/date.util";
import CreateApplicationDto from "../dto/create-application.dto";
import CandidateRepository from "../repository/candidate.repository";

class ApplicationService {
    constructor(
        private candidateRepository: CandidateRepository,
        private openingService: OpeningService,
        private roleService: RoleService
    ) { }

    async getApplicationById(id: string): Promise<Candidate | null> {
        const application = await this.candidateRepository.findApplicationById(id);
        if (!application) {
            throw new HttpException(404, "Referral not found", "NOT FOUND");
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
}

export default ApplicationService;

