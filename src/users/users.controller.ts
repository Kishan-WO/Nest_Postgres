import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors, UsePipes } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UsersService } from "./users.service";
import { CreateUserDTO } from "./dto/createUser.dto";
import { UpdateUserDTO } from "./dto/updateUser.dto";
import { ApiTags } from "@nestjs/swagger";
import { User } from "./entities/user.entity";
import { TrimPipe } from "../common/pipes/trim.pipe";
import { PositiveIntPipe } from "../common/pipes/positive-int.pipe";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "./enums/role.enum";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import {
    ApiCreateUserDocs,
    ApiDeleteUserDocs,
    ApiFindAllUsersDocs,
    ApiFindUserByIdDocs,
    ApiUpdateUserDocs,
} from "./swagger/users.swagger";

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @ApiFindAllUsersDocs()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async findAllUsers(): Promise<User[]> {
        return this.usersService.findAllUsers();
    }

    @Get(':id')
    @ApiFindUserByIdDocs()
    @UseGuards(JwtAuthGuard)
    async findUserById(
        @Param('id', PositiveIntPipe) id: number,
    ): Promise<User> {
        return this.usersService.findUserById(id);
    }

    @Post()
    @ApiCreateUserDocs()
    @UseInterceptors(FileInterceptor('file'))
    async createUser(
        @Body(TrimPipe) createUserDto: CreateUserDTO,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<User> {
        return this.usersService.createUser(createUserDto, file);
    }

    @Patch(':id')
    @ApiUpdateUserDocs()
    @UseGuards(JwtAuthGuard)
    @UsePipes(TrimPipe)
    @UseInterceptors(FileInterceptor('file'))
    async updateUser(
        @Param('id', PositiveIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDTO,
        @CurrentUser() currentUser: any,
        @UploadedFile() file?: Express.Multer.File,
    ): Promise<User> {
        return this.usersService.updateUser(id, updateUserDto, currentUser, file);
    }

    @Delete(':id')
    @ApiDeleteUserDocs()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async deleteUser(
        @Param('id', PositiveIntPipe) id: number,
    ): Promise<{ message: string; deletedUser: User }> {
        return this.usersService.deleteUser(id);
    }
}