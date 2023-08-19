import dataSource from "../db/postgres.db";
import Referral from "../entity/referral.entity";
import ReferralRepository from "../repository/referral.repository";
import ReferralService from "../service/referral.service";
import { openingService } from "./opening.route";
import { employeeService } from "./employee.route";
import { roleService } from "./role.route";
import ReferralController from "../controller/referral.controller";

const referralRepository = new ReferralRepository(dataSource.getRepository(Referral));
const referralService = new ReferralService(referralRepository, employeeService, openingService, roleService);
const referralController = new ReferralController(referralService);
const referralRoute = referralController.router;

export { referralService as openingService };
export default referralRoute;
