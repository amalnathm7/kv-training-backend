import dataSource from "../db/postgres.db";
import Candidate from "../entity/candidate.entity";
import CandidateRepository from "../repository/candidate.repository";
import ReferralService from "../service/referral.service";
import { openingService } from "./opening.route";
import { employeeService } from "./employee.route";
import { roleService } from "./role.route";
import ReferralController from "../controller/referral.controller";

const candidateRepository = new CandidateRepository(dataSource.getRepository(Candidate));
const referralService = new ReferralService(candidateRepository, employeeService, openingService, roleService);
const referralController = new ReferralController(referralService);
const referralRoute = referralController.router;

export { referralService };
export default referralRoute;
