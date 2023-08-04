import { IsNotEmpty, IsString } from "class-validator";

class CreateDepartmentDto {
    @IsNotEmpty()
    @IsString()
    name: string
}

export default CreateDepartmentDto;