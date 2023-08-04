import { IsNotEmpty, IsString } from "class-validator";

class CreateDepartmentDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    description: string;
}

export default CreateDepartmentDto;