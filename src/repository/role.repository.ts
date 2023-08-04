import { Repository } from "typeorm";
import { Role } from "../entity/role.entity";

class RoleRepository {
    constructor(private roleRepository: Repository<Role>) { };

    findAllRoles(): Promise<Role[]> {
        return this.roleRepository.find();
    }

    findRole(id: string): Promise<Role> {
        return this.roleRepository.findOneBy({ id });
    }

    saveRole(role: Role) {
        return this.roleRepository.save(role);
    }

    deleteRole(role: Role) {
        return this.roleRepository.remove(role);
    }
}

export default RoleRepository;