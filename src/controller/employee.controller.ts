import express from "express";
import EmployeeService from "../service/employee.service";

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

    getAllEmployees = async (req: express.Request, res: express.Response) => {
        const employees = await this.employeeService.getAllEmployees();
        res.status(200).send(employees);
    }

    getEmployeeById = async (req: express.Request, res: express.Response) => {
        const employeeId = Number(req.params.id);
        const employee = await this.employeeService.getEmployeeById(employeeId);
        res.status(200).send(employee);
    }

    createEmployee = async (req: express.Request, res: express.Response) => {
        const name = req.body.name;
        const email = req.body.email;
        const newEmployee = await this.employeeService.createEmployee(name, email);
        res.status(201).send(newEmployee);
    }

    setEmployee = async (req: express.Request, res: express.Response) => {
        const employeeId = Number(req.params.id);
        const name = req.body.name;
        const email = req.body.email;
        const isSet = await this.employeeService.setEmployee(employeeId, name, email);
        if (isSet) {
            res.status(204).send();
        } else {
            res.status(404).send({ "error": "Employee not found" });
        }
    }

    updateEmployee = async (req: express.Request, res: express.Response) => {
        const employeeId = Number(req.params.id);
        const name = req.body.name;
        const email = req.body.email;
        const isUpdated = await this.employeeService.updateEmployee(employeeId, name, email);
        if (isUpdated) {
            res.status(204).send();
        } else {
            res.status(404).send({ "error": "Employee not found" });
        }
    }

    deleteEmployee = async (req: express.Request, res: express.Response) => {
        const employeeId = Number(req.params.id);
        const isDeleted = await this.employeeService.deleteEmployee(employeeId);

        if (isDeleted) {
            res.status(204).send();
        } else {
            res.status(404).send({ "error": "Employee not found" });
        }
    }
}

export default EmployeeController;