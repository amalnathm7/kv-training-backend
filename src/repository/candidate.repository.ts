import { FindOptionsWhere, IsNull, Not, Repository } from "typeorm";
import Candidate from "../entity/candidate.entity";

class CandidateRepository {
    constructor(private candidateRepository: Repository<Candidate>) { }

    findAllReferrals(offset: number, pageLength: number, where: FindOptionsWhere<Candidate>): Promise<[Candidate[], number]> {
        return this.candidateRepository.findAndCount({
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
        return this.candidateRepository.findOne({
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
        return this.candidateRepository.find({
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
        return this.candidateRepository.find({
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
        return this.candidateRepository.save(candidate);
    }

    deleteCandidate(candidate: Candidate): Promise<Candidate> {
        return this.candidateRepository.softRemove(candidate);
    }

    findAllApplications(offset: number, pageLength: number, where: FindOptionsWhere<Candidate>): Promise<[Candidate[], number]> {
        return this.candidateRepository.findAndCount({
            where: {
                ...where,
                referredBy: IsNull()
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

    findApplicationById(id: string): Promise<Candidate | null> {
        return this.candidateRepository.findOne({
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
        return this.candidateRepository.find({
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
