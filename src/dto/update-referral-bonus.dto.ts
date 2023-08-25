import { IsEnum, IsNotEmpty } from "class-validator";
import { ValidateDto } from "./validate.dto";
import { BonusStatus } from "../utils/status.enum";

class UpdateReferralBonusDto implements ValidateDto {
    @IsNotEmpty()
    @IsEnum(BonusStatus)
    bonusStatus: BonusStatus;
}

export default UpdateReferralBonusDto;
