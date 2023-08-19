import CreateOpeningDto from "../dto/create-opening.dto";
import Opening from "../entity/opening.entity";
import HttpException from "../exception/http.exception";
import DepartmentService from "./department.service";
import RoleService from "./role.service";

class OpeningService {
  constructor(
    private openingRepository: OpeningRepository,
    private departmentService: DepartmentService,
    private roleService: RoleService,
  ) {}

  getAllOpenings( offset: number, pageLength: number): Promise<[Opening[], number]> {
    return this.openingRepository.findAllOpenings(offset, pageLength);
  }

  async getOpeningById (id: string): Promise<Opening | null> {
    const opening = await this.openingRepository.findOpeningById(id);
    if(!opening){
        throw new HttpException(404,"Opening not found","NOT FOUND");
    }
    return opening;
  }

  async createOpening(createOpeningDto: CreateOpeningDto): Promise <Opening>{
    const { title, descrption, skills, count, location, experience, departmentId, roleId} = createOpeningDto;
    const newOpening = new Opening();
    newOpening.title = title;
    newOpening.descrption = descrption;
    newOpening.skills = skills;
    newOpening.count = count;
    newOpening.location = location;
    newOpening.experience = experience;

    if (departmentId){
        const department= await this.departmentService.getDepartmentById(departmentId);
        newOpening.department = department;
    }

    if(roleId){
        const role = await this.roleService.getRole(roleId);
        newOpening.role = role;
    }

    return this.openingRepository.saveOpening(newOpening);
  }
  
  async updateOpening(id: string, updateOpeningDto: UpdateOpeningDto):Promise<void>{
    const opening = await this.getOpeningById(id);
    opening.title = updateOpeningDto.title;
    opening.descrption = updateOpeningDto.descrption;
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
  }

  async deleteOpening(id: string): Promise<void> {
    const opening = await this.getOpeningById(id);
    this.openingRepository.deleteOpening(opening);
  }
}