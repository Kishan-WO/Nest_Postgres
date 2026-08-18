import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { UserRole } from "../enums/role.enum";

export class CreateUserDTO {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(3, { message: 'Name must be at least 3 charaters long' })
    @MaxLength(50, { message: 'Name can not be longer than 50 charaters' })
    name: string;

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(6, { message: 'Password must be at least 6 charaters long' })
    password: string;

    @IsOptional()
    @IsEnum(UserRole, { message: 'Role must be either user or admin' })
    role?: UserRole;
}