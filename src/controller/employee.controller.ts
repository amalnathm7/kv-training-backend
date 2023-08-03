import express, { NextFunction } from "express";
import EmployeeService from "../service/employee.service";
import { plainToInstance } from "class-transformer";
import CreateEmployeeDto from "../dto/create-employee.dto";
import { validate } from "class-validator";
import ValidationException from "../exception/validation.exception";
import UpdateEmployeeDto from "../dto/update-employee.dto";

class EmployeeController {
    public router: express.Router;

    constructor(private employeeService: EmployeeService) {
        this.router = express.Router();
        this.router.post("/", this.createEmployee);
        this.router.get("/", this.getAllEmployees);
        this.router.get("/:id", this.getEmployeeById);
        this.router.put("/:id", this.setEmployee);
        this.router.patch("/:id", this.updateEmployee);
        this.router.delete("/:id", this.deleteEmployee);
    }

    getAllEmployees = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const employees = await this.employeeService.getAllEmployees();
            res.status(200).send(employees);
        } catch (e) {
            next(e);
        }
    }

    getEmployeeById = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const employeeId = Number(req.params.id);
            const employee = await this.employeeService.getEmployeeById(employeeId);
            res.status(200).send(employee);
        } catch (error) {
            next(error);
        }
    }

    createEmployee = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const { name, email, address } = req.body;
            const createEmployeeDto = plainToInstance(CreateEmployeeDto, req.body);
            const errors = await validate(createEmployeeDto);
            if (errors.length > 0) {
                throw new ValidationException(400, "Validation Errors", errors);
            } else {
                const newEmployee = await this.employeeService.createEmployee(name, email, address);
                res.status(201).send(newEmployee);
            }
        } catch (error) {
            next(error);
        }
    }

    setEmployee = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const employeeId = Number(req.params.id);
            const { name, email, address } = req.body;
            const createEmployeeDto = plainToInstance(CreateEmployeeDto, req.body);
            const errors = await validate(createEmployeeDto);
            if (errors.length > 0) {
                throw new ValidationException(400, "Validation Errors", errors);
            } else {
                await this.employeeService.updateEmployee(employeeId, name, email, address);
                res.status(204).send();
            }
        } catch (error) {
            next(error);
        }
    }

    updateEmployee = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const employeeId = Number(req.params.id);
            const { name, email, address } = req.body;
            const updateEmployeeDto = plainToInstance(UpdateEmployeeDto, req.body);
            const errors = await validate(updateEmployeeDto);
            if (errors.length > 0) {
                throw new ValidationException(400, "Validation Errors", errors);
            } else {
                await this.employeeService.updateEmployee(employeeId, name, email, address);
                res.status(204).send();
            }
        } catch (error) {
            next(error);
        }
    }

    deleteEmployee = async (req: express.Request, res: express.Response, next: NextFunction) => {
        try {
            const employeeId = Number(req.params.id);
            await this.employeeService.deleteEmployee(employeeId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default EmployeeController;