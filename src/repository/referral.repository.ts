import { FindOptionsWhere, IsNull, Not, Repository } from "typeorm";
import Referral from "../entity/referral.entity";

class ReferralRepository {
    constructor(private referralRepository: Repository<Referral>) { }

    findAllReferrals(offset: number, pageLength: number, where: FindOptionsWhere<Referral>): Promise<[Referral[], number]> {
        return this.referralRepository.findAndCount({
            where: {
                ...where,
                referredBy: Not(IsNull())
            },
            order: {
                createdAt: "asc",
            },
            skip: offset * pageLength,
            take: pageLength,
            relations: {
                address: true,
                opening: true,
                referredBy: true,
                role: true
            }
        });
    }

    findReferralById(id: string): Promise<Referral | null> {
        return this.referralRepository.findOne({
            where: {
                id,
                referredBy: Not(IsNull())
            },
            relations: {
                address: true,
                opening: true,
                referredBy: true,
                role: true
            }
        });
    }

    findReferralsByEmail(email: string): Promise<Referral[]> {
        return this.referralRepository.find({
            where: {
                email,
                referredBy: Not(IsNull())
            },
            relations: {
                address: true,
                opening: true,
                referredBy: true,
                role: true
            }
        });
    }

    findReferralsReferredByEmail(email: string): Promise<Referral[]> {
        return this.referralRepository.find({
            where: {
                referredBy: {
                    email
                }
            },
            relations: {
                address: true,
                opening: true,
                referredBy: true,
                role: true
            }
        });
    }

    saveReferral(referral: Referral): Promise<Referral> {
        return this.referralRepository.save(referral);
    }

    deleteReferral(referral: Referral): Promise<Referral> {
        return this.referralRepository.softRemove(referral);
    }
}

export default ReferralRepository;
