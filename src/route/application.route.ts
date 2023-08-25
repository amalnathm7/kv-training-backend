import dataSource from "../db/postgres.db";
import Candidate from "../entity/candidate.entity";
import CandidateRepository from "../repository/candidate.repository";
import { openingService } from "./opening.route";
import { roleService } from "./role.route";
import ApplicationController from "../controller/application.controller";
import ApplicationService from "../service/application.service";
import { employeeService } from "./employee.route";

const candidateRepository = new CandidateRepository(dataSource.getRepository(Candidate));
const applicationService = new ApplicationService(candidateRepository, employeeService, openingService, roleService);
const applicationController = new ApplicationController(applicationService);
const applicationRoute = applicationController.router;

export { applicationService };
export default applicationRoute;