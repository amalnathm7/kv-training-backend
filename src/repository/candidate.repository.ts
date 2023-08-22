import { FindOptionsWhere, IsNull, Not, Repository } from "typeorm";
import Candidate from "../entity/candidate.entity";

class CandidateRepository {
    constructor(private referralRepository: Repository<Candidate>) { }

    findAllReferrals(offset: number, pageLength: number, where: FindOptionsWhere<Candidate>): Promise<[Candidate[], number]> {
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

    findReferralById(id: string): Promise<Candidate | null> {
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

    findReferralsByEmail(email: string): Promise<Candidate[]> {
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

    findReferralsReferredByEmail(email: string): Promise<Candidate[]> {
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

    saveCandidate(candidate: Candidate): Promise<Candidate> {
        return this.referralRepository.save(candidate);
    }

    deleteCandidate(candidate: Candidate): Promise<Candidate> {
        return this.referralRepository.softRemove(candidate);
    }

    findApplicationById(id: string): Promise<Candidate | null> {
        return this.referralRepository.findOne({
            where: {
                id,
                referredBy: IsNull()
            },
            relations: {
                address: true,
                opening: true,
                referredBy: true,
                role: true
            }
        });
    }

    findApplicationsByEmail(email: string): Promise<Candidate[]> {
        return this.referralRepository.find({
            where: {
                email,
                referredBy: IsNull()
            },
            relations: {
                address: true,
                opening: true,
                referredBy: true,
                role: true
            }
        });
    }
}

export default CandidateRepository;
