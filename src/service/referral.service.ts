import Address from "../entity/address.entity";
import HttpException from "../exception/http.exception";
import RoleService from "./role.service";
import ReferralRepository from "../repository/referral.repository";
import Referral from "../entity/referral.entity";
import CreateReferralDto from "../dto/create-referral.dto";
import UpdateReferralDto from "../dto/update-referral.dto";
import EmployeeService from "./employee.service";
import OpeningService from "../service/opening.service";
import { ReferralStatus } from "../utils/status.enum";
import { PermissionLevel } from "../utils/permission.level.enum";
import { Like } from "typeorm";

class ReferralService {
    constructor(
        private referralRepository: ReferralRepository,
        private employeeService: EmployeeService,
        private openingService: OpeningService,
        private roleService: RoleService
    ) { }

    getAllReferrals(offset: number, pageLength: number, email: string, role: string): Promise<[Referral[], number]> {
        const whereClause = {
            email: Like(`%${email}%`),
            role: {
                role: Like(`%${role}%`)
            }
        }
        return this.referralRepository.findAllReferrals(offset, pageLength, whereClause);
    }

    async getReferralById(id: string): Promise<Referral | null> {
        const referral = await this.referralRepository.findReferralById(id);
        if (!referral) {
            throw new HttpException(404, "Referral not found", "NOT FOUND");
        }
        return referral;
    }

    async getReferralsByEmail(email: string): Promise<Referral[]> {
        const referral = await this.referralRepository.findReferralsByEmail(email);
        if (!referral) {
            throw new HttpException(404, "Referrals not found", "NOT FOUND");
        }
        return referral;
    }

    async getReferralsReferredByEmail(email: string): Promise<Referral[]> {
        const referrals = await this.referralRepository.findReferralsReferredByEmail(email);
        if (!referrals) {
            throw new HttpException(404, "Referrals not found", "NOT FOUND");
        }
        return referrals;
    }

    async createReferral(createReferralDto: CreateReferralDto): Promise<Referral> {
        const { name, email, experience, address, roleId, phone, openingId, referredById, resume } = createReferralDto;


        const referrals = await this.referralRepository.findReferralsByEmail(email)
        if (referrals) {
            const referralWithSameRole = referrals.find((referral) => referral.role.id == roleId)
            if (referralWithSameRole) {
                let currentDate = new Date();
                const currentDateMonth = currentDate.getMonth();
                const oldDateMonth = referralWithSameRole.createdAt.getMonth();
                if (currentDateMonth - oldDateMonth < 6) {
                    throw new HttpException(409, "Cannot create a referral for the same role for the same person within 6 months", "NOT CREATED")
                }
            }
        }


        const newReferral = new Referral();
        newReferral.name = name;
        newReferral.email = email;
        newReferral.experience = experience;
        newReferral.status = ReferralStatus.RECEIVED;
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

        return this.referralRepository.saveReferral(newReferral);
    }

    async deleteReferral(id: string, roleId: string, email: string): Promise<void> {
        const referral = await this.getReferralById(id);
        const role = await this.roleService.getRole(roleId);
    
        if (referral.referredBy.email !== email && role.permissionLevel !== PermissionLevel.SUPER) {
            throw new HttpException(403, "You are not authorized to perform this action", "Forbidden");
        }

        if (referral.status !== ReferralStatus.RECEIVED && role.permissionLevel !== PermissionLevel.SUPER) {
            throw new HttpException(403, "Candidate has been moved to furthur stages", "Forbidden");
        }

        this.referralRepository.deleteReferral(referral);
    }

    async updateReferral(id: string, roleId: string, email: string, updateReferralDto: UpdateReferralDto): Promise<void> {
        const referral = await this.getReferralById(id);
        const role = await this.roleService.getRole(roleId);
    
        if (referral.referredBy.email !== email && role.permissionLevel !== PermissionLevel.SUPER) {
            throw new HttpException(403, "You are not authorized to perform this action", "Forbidden");
        }

        referral.name = updateReferralDto.name;
        referral.email = updateReferralDto.email;
        referral.experience = updateReferralDto.experience;
        referral.phone = updateReferralDto.phone;

        if (role.permissionLevel === PermissionLevel.SUPER) {
            referral.status = updateReferralDto.status;
        }

        if (updateReferralDto.roleId) {
            const role = await this.roleService.getRole(updateReferralDto.roleId);
            referral.role = role;
        }

        if (updateReferralDto.referredById) {
            const referredBy = await this.employeeService.getEmployeeById(updateReferralDto.referredById);
            referral.referredBy = referredBy;
        }

        if (updateReferralDto.openingId) {
            const opening = await this.openingService.getOpeningById(updateReferralDto.openingId);
            referral.opening = opening;
        }

        if (updateReferralDto.address) {
            referral.address.line1 = updateReferralDto.address.line1;
            referral.address.line2 = updateReferralDto.address.line2;
            referral.address.city = updateReferralDto.address.city;
            referral.address.state = updateReferralDto.address.state;
            referral.address.country = updateReferralDto.address.country;
            referral.address.pincode = updateReferralDto.address.pincode;
        }

        this.referralRepository.saveReferral(referral);
    }
}

export default ReferralService;
