import Address from "../entity/address.entity";
import HttpException from "../exception/http.exception";
import RoleService from "./role.service";
import CandidateRepository from "../repository/candidate.repository";
import Candidate from "../entity/candidate.entity";
import CreateReferralDto from "../dto/create-referral.dto";
import UpdateReferralDto from "../dto/update-referral.dto";
import EmployeeService from "./employee.service";
import OpeningService from "../service/opening.service";
import { BonusStatus, CandidateStatus } from "../utils/status.enum";
import { PermissionLevel } from "../utils/permission.level.enum";
import { FindOptionsWhere, ILike } from "typeorm";
import UpdateOpeningDto from "../dto/update-opening.dto";
import { compareDateMonts } from "../utils/date.util";
import Employee from "../entity/employee.entity";
import UpdateReferralBonusDto from "../dto/update-referral-bonus.dto";
import winstonLogger from "../utils/winston.logger";

class ReferralService {
    constructor(
        private candidateRepository: CandidateRepository,
        private employeeService: EmployeeService,
        private openingService: OpeningService,
        private roleService: RoleService
    ) { }

    getAllReferrals(offset: number, pageLength: number, email: string, role: string, status: CandidateStatus, openingId: string): Promise<[Candidate[], number]> {
        const whereClause: FindOptionsWhere<Candidate> = {
            email: ILike(`%${email}%`),
            role: {
                role: ILike(`%${role}%`)
            },
            status,
            opening: {
                id: openingId || null
            }
        }
        return this.candidateRepository.findAllReferrals(offset, pageLength, whereClause);
    }

    async getReferralById(id: string): Promise<Candidate | null> {
        const referral = await this.candidateRepository.findReferralById(id);
        if (!referral) {
            throw new HttpException(404, "Referral not found", "NOT FOUND");
        }
        return referral;
    }

    async getReferralsByEmail(email: string): Promise<Candidate[]> {
        const referral = await this.candidateRepository.findReferralsByEmail(email);
        if (!referral) {
            throw new HttpException(404, "Referrals not found", "NOT FOUND");
        }
        return referral;
    }

    async getReferralsReferredByEmail(email: string): Promise<Candidate[]> {
        const referrals = await this.candidateRepository.findReferralsReferredByEmail(email);
        if (!referrals) {
            throw new HttpException(404, "Referrals not found", "NOT FOUND");
        }
        return referrals;
    }

    async createReferral(createReferralDto: CreateReferralDto): Promise<Candidate> {
        const { name, email, experience, address, roleId, phone, openingId, referredById, resume } = createReferralDto;

        const referrals = await this.candidateRepository.findReferralsByEmail(email)
        const referralsWithSameRole = referrals.filter((referral) => referral.role.id === roleId);
        let currentDate = new Date();
        referralsWithSameRole.forEach((referral) => {
            const isLessThan6Months = !compareDateMonts(currentDate, referral.createdAt, 6);
            if (isLessThan6Months) {
                throw new HttpException(409, "Cannot create a referral for the same role for the same person within 6 months", "NOT CREATED")
            }
        });

        const newReferral = new Candidate();
        newReferral.name = name;
        newReferral.email = email;
        newReferral.experience = experience;
        newReferral.status = CandidateStatus.RECEIVED;
        newReferral.phone = phone;
        newReferral.resume = resume;

        const role = await this.roleService.getRole(roleId);
        newReferral.role = role;

        const referredBy = await this.employeeService.getEmployeeById(referredById);
        newReferral.referredBy = referredBy;

        const opening = await this.openingService.getOpeningById(openingId);
        newReferral.opening = opening;

        const newAddress = new Address();
        newAddress.line1 = address.line1;
        newAddress.line2 = address.line2;
        newAddress.city = address.city;
        newAddress.state = address.state;
        newAddress.country = address.country;
        newAddress.pincode = address.pincode;
        newReferral.address = newAddress;

        return this.candidateRepository.saveCandidate(newReferral);
    }

    async deleteReferral(id: string, roleId: string, email: string): Promise<void> {
        const referral = await this.getReferralById(id);
        if (referral.status === CandidateStatus.HIRED) {
            throw new HttpException(403, "Referral already Hired", "Forbidden");
        }
        const role = await this.roleService.getRole(roleId);

        if (referral.referredBy.email !== email && role.permissionLevel !== PermissionLevel.SUPER) {
            throw new HttpException(403, "You are not authorized to perform this action", "Forbidden");
        }

        if (referral.status !== CandidateStatus.RECEIVED && role.permissionLevel !== PermissionLevel.SUPER) {
            throw new HttpException(403, "Candidate has been moved to furthur stages", "Forbidden");
        }

        this.candidateRepository.deleteCandidate(referral);
    }

    async updateReferral(id: string, roleId: string, email: string, updateReferralDto: UpdateReferralDto): Promise<Employee | null> {
        const referral = await this.getReferralById(id);
        if (referral.status === CandidateStatus.HIRED) {
            throw new HttpException(403, "Referral already hired", "Forbidden");
        }
        const role = await this.roleService.getRole(roleId);
        let employee: Employee = null;

        if (referral.referredBy.email !== email && role.permissionLevel !== PermissionLevel.SUPER) {
            throw new HttpException(403, "You are not authorized to perform this action", "Forbidden");
        }

        referral.name = updateReferralDto.name;
        referral.email = updateReferralDto.email;
        referral.experience = updateReferralDto.experience;
        referral.phone = updateReferralDto.phone;
        referral.resume = updateReferralDto.resume;

        const openingId = updateReferralDto.openingId ? updateReferralDto.openingId : referral.opening.id;
        const opening = await this.openingService.getOpeningById(openingId);
        if (updateReferralDto.openingId) {
            referral.opening = opening;
        }

        if (updateReferralDto.roleId) {
            const role = await this.roleService.getRole(updateReferralDto.roleId);
            referral.role = role;
        }

        if (updateReferralDto.referredById) {
            const referredBy = await this.employeeService.getEmployeeById(updateReferralDto.referredById);
            referral.referredBy = referredBy;
        }

        if (updateReferralDto.address) {
            referral.address.line1 = updateReferralDto.address.line1;
            referral.address.line2 = updateReferralDto.address.line2;
            referral.address.city = updateReferralDto.address.city;
            referral.address.state = updateReferralDto.address.state;
            referral.address.country = updateReferralDto.address.country;
            referral.address.pincode = updateReferralDto.address.pincode;
        }

        if (role.permissionLevel === PermissionLevel.SUPER) {
            if (updateReferralDto.status === CandidateStatus.HIRED) {
                if (opening.count <= 0) {
                    throw new HttpException(403, "No more openings available for this position", "Forbidden");
                }
                const openingUpdateDto: UpdateOpeningDto = {...opening, departmentId: opening.department.id, roleId: opening.role.id}
                openingUpdateDto.count--;
                await this.openingService.updateOpening(opening.id, openingUpdateDto);

                employee = await this.employeeService.createEmployeeFromCandidate(referral, opening.department, opening.role);
                referral.bonusStatus = BonusStatus.PROCESSING;
            }
            referral.status = updateReferralDto.status;
        }

        this.candidateRepository.saveCandidate(referral);
        return employee;
    }

    async updateReferralBonusStatus(id: string, updateBonusDto: UpdateReferralBonusDto): Promise<void> {
        const bonusStatus = updateBonusDto.bonusStatus
        const referral = await this.getReferralById(id);
        switch (referral.bonusStatus) {
            case BonusStatus.INACTIVE: {
                throw new HttpException(403, "Referral already inactive", "Forbidden");
            }
            case BonusStatus.APPROVED: {
                throw new HttpException(403, "Referral bonus already approved", "Forbidden");
            }
            case BonusStatus.PROCESSING: {
                if (bonusStatus !== BonusStatus.ELIGIBLE && bonusStatus !== BonusStatus.INACTIVE && bonusStatus !== BonusStatus.APPROVED) {
                    throw new HttpException(403, "Invalid new Bonus Status", "Forbidden");
                }
                referral.bonusStatus = bonusStatus;
                break;
            }
            case BonusStatus.ELIGIBLE: {
                if (bonusStatus !== BonusStatus.APPROVED && bonusStatus !== BonusStatus.INACTIVE) {
                    throw new HttpException(403, "Invalid new Bonus Status", "Forbidden");
                }
                referral.bonusStatus = bonusStatus;
                break;
            }
        }
        this.candidateRepository.saveCandidate(referral);
    }

    async checkBonusEligibility(): Promise<void> {
        const employees = await this.employeeService.getAllEmployeesEmployedFor3Months();
        for (const employee of employees) {
            const referrals = await this.getReferralsByEmail(employee.email);
            const referral = referrals.find((referral) => referral.status === CandidateStatus.HIRED && referral.bonusStatus === BonusStatus.PROCESSING);
            if (referral) {
                await this.updateReferralBonusStatus(referral.id, { bonusStatus: BonusStatus.ELIGIBLE });
                winstonLogger.log({
                    level: 'info',
                    timeStamp: new Date(),
                    message: `Referral ${referral.id} Eligible for Bonus`,
                });
            }
        }
    }
}

export default ReferralService;
