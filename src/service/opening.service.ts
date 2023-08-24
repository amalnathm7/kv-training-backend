import { FindOptionsWhere, MoreThan } from "typeorm";
import CreateOpeningDto from "../dto/create-opening.dto";
import UpdateOpeningDto from "../dto/update-opening.dto";
import Opening from "../entity/opening.entity";
import HttpException from "../exception/http.exception";
import OpeningRepository from "../repository/opening.repository";
import DepartmentService from "./department.service";
import RoleService from "./role.service";
import { PermissionLevel } from "../utils/permission.level.enum";

class OpeningService {
  constructor(
    private openingRepository: OpeningRepository,
    private departmentService: DepartmentService,
    private roleService: RoleService,
  ) { }

  async getAllOpenings(offset: number, pageLength: number, roleId?: string): Promise<[Opening[], number]> {
    if (roleId) {
      const role = await this.roleService.getRole(roleId);
      if (role.permissionLevel === PermissionLevel.SUPER) {
        return this.openingRepository.findAllOpenings(offset, pageLength);
      }
    }
    const whereClause: FindOptionsWhere<Opening> = {
      count: MoreThan(0)
    };
    return this.openingRepository.findAllOpenings(offset, pageLength, whereClause);
  }

  async getOpeningById(id: string): Promise<Opening | null> {
    const opening = await this.openingRepository.findOpeningById(id);
    if (!opening) {
      throw new HttpException(404, "Opening not found", "NOT FOUND");
    }
    return opening;
  }

  async createOpening(createOpeningDto: CreateOpeningDto): Promise<Opening> {
    const { title, description: description, skills, count, location, experience, departmentId, roleId } = createOpeningDto;
    const newOpening = new Opening();
    newOpening.title = title;
    newOpening.description = description;
    newOpening.skills = skills;
    newOpening.count = count;
    newOpening.location = location;
    newOpening.experience = experience;

    const department = await this.departmentService.getDepartmentById(departmentId);
    newOpening.department = department;

    const role = await this.roleService.getRole(roleId);
    newOpening.role = role;

    return this.openingRepository.saveOpening(newOpening);
  }

  async updateOpening(id: string, updateOpeningDto: UpdateOpeningDto): Promise<void> {
    const opening = await this.getOpeningById(id);
    opening.title = updateOpeningDto.title;
    opening.description = updateOpeningDto.description;
    opening.skills = updateOpeningDto.skills;
    opening.count = updateOpeningDto.count;
    opening.location = updateOpeningDto.location;
    opening.experience = updateOpeningDto.experience;

    if (updateOpeningDto.roleId) {
      const role = await this.roleService.getRole(updateOpeningDto.roleId);
      opening.role = role;
    }

    if (updateOpeningDto.departmentId) {
      const department = await this.departmentService.getDepartmentById(updateOpeningDto.departmentId);
      opening.department = department;
    }
    this.openingRepository.saveOpening(opening)
  }

  async deleteOpening(id: string): Promise<void> {
    const opening = await this.getOpeningById(id);
    this.openingRepository.deleteOpening(opening);
  }
}

export default OpeningService;