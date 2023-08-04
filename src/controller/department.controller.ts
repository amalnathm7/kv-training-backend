import express, { NextFunction, Request, Response } from "express"
import DepartmentService from "../service/department.service";
import authenticate from "../middleware/authenticate.middleware";
import { plainToInstance } from "class-transformer";
import CreateDepartmentDto from "../dto/create-department.dto";
import { validate } from "class-validator";
import ValidationException from "../exception/validation.exception";
import UpdateDepartmentDto from "../dto/update-department.dto";
import authorize from "../middleware/authorize.middleware";

class DepartmentController {
    public router: express.Router;

    constructor(private departmentService: DepartmentService) {
        this.router = express.Router();
        this.router.post("/", authenticate, authorize, this.createDepartment);
        this.router.get("/", this.getAllDepartments);
        this.router.get("/:id", this.getDepartmentById);
        this.router.put("/:id", authenticate, authorize, this.setDepartment);
        this.router.patch("/:id", authenticate, authorize, this.updateDepartment);
        this.router.delete("/:id", authenticate, authorize, this.deleteDepartment);
    }

    createDepartment = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const createDepartmentDto = plainToInstance(CreateDepartmentDto, req.body);
            const errors = await validate(createDepartmentDto);
            if (errors.length > 0) {
                throw new ValidationException(errors);
            } else {
                const newDepartment = await this.departmentService.createDepartment(createDepartmentDto);
                res.status(201).send(newDepartment);
            }
        } catch (error) {
            next(error);
        }
    }

    getAllDepartments = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const departments = await this.departmentService.getAllDepartments();
            res.status(200).send(departments);
        } catch (error) {
            next(error);
        }
    }

    getDepartmentById = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const departmentId = Number(req.params.id);
            const department = await this.departmentService.getDepartmentById(departmentId);
            res.status(200).send(department);
        } catch (error) {
            next(error);
        }
    }

    setDepartment = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const departmentId = Number(req.params.id);
            const createDepartmentDto = plainToInstance(CreateDepartmentDto, req.body);
            const errors = await validate(createDepartmentDto);
            if (errors.length > 0) {
                throw new ValidationException(errors);
            } else {
                await this.departmentService.updateDepartment(departmentId, createDepartmentDto);
                res.status(204).send();
            }
        } catch (error) {
            next(error);
        }
    }

    updateDepartment = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const departmentId = Number(req.params.id);
            const updateDepartmentDto = plainToInstance(UpdateDepartmentDto, req.body);
            const errors = await validate(updateDepartmentDto);
            if (errors.length > 0) {
                throw new ValidationException(errors);
            } else {
                await this.departmentService.updateDepartment(departmentId, updateDepartmentDto);
                res.status(204).send();
            }
        } catch (error) {
            next(error);
        }
    }

    deleteDepartment = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const departmentId = Number(req.params.id);
            await this.departmentService.deleteDepartment(departmentId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default DepartmentController;