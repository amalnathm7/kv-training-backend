import UpdateRoleDto from "../dto/create-role.dto";
import { Role } from "../entity/role.entity";
import HttpException from "../exception/http.exception";
import RoleRepository from "../repository/role.repository";

class RoleService {
    constructor(private roleRepository: RoleRepository) { }

    getAllRoles(): Promise<Role[]> {
        return this.roleRepository.findAllRoles();
    }

    getRole(id: string): Promise<Role> {
        const role = this.roleRepository.findRole(id);
        if (!role) {
            throw new HttpException(404, "Role not found", "NOT FOUND");
        }
        return role;
    }

    createRole(createRoleDto: UpdateRoleDto): Promise<Role> {
        const role = new Role();
        role.role = createRoleDto.role;
        role.permissionLevel = createRoleDto.permissionLevel;
        return this.roleRepository.saveRole(role);
    }

    async updateRole(id: string, updateRoleDto: UpdateRoleDto) {
        const role = await this.getRole(id);
        role.role = updateRoleDto.role;
        role.permissionLevel = updateRoleDto.permissionLevel;
        this.roleRepository.saveRole(role);
    }

    async deleteRole(id: string) {
        const role = await this.getRole(id);
        this.roleRepository.deleteRole(role);
    }
}

export default RoleService;