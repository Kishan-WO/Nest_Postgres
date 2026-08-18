import { PartialType } from "@nestjs/swagger";
import { CreateUserDTO } from "./createUser.dto";

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}
