import OpeningController from "../controller/opening.controller";
import dataSource from "../db/postgres.db";
import Opening from "../entity/opening.entity";
import OpeningRepository from "../repository/opening.repository";
import OpeningService from "../service/opening.service";
import { departmentService } from "./department.route";
import { roleService } from "./role.route";

const openingRepository = new OpeningRepository(dataSource.getRepository(Opening));
const openingService = new OpeningService(openingRepository, departmentService, roleService);
const openingController = new OpeningController(openingService);
const openingRoute = openingController.router;

export { openingService };
export default openingRoute;
