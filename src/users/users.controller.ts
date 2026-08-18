import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UsersService } from "./users.service";
import { CreateUserDTO } from "./dto/createUser.dto";
import { UpdateUserDTO } from "./dto/updateUser.dto";
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./entities/user.entity";

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @ApiOperation({
        summary: "Get all users",
        description: "Retrieves a list of all registered users",
    })
    @ApiResponse({ status: 200, description: 'Users retrieved successfully.' })
    async findAllUsers(): Promise<User[]> {
        return this.usersService.findAllUsers();
    }

    @Get(':id')
    @ApiOperation({
        summary: "Get user by ID",
        description: "Retrieves details of a specific user by ID",
    })
    @ApiParam({ name: 'id', description: 'User ID', example: 1 })
    @ApiResponse({ status: 200, description: 'User retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    async findUserById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<User> {
        return this.usersService.findUserById(id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({
        summary: "Create a new user",
        description: "Creates a new user with the provided details and mandatory avatar file upload",
    })
    @ApiBody({
        schema: {
            type: 'object',
            required: ['name', 'email', 'password', 'file'],
            properties: {
                name: { type: 'string', example: 'John Doe' },
                email: { type: 'string', example: 'john@example.com' },
                password: { type: 'string', example: 'secret123' },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'User avatar file',
                },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'User created successfully.' })
    async createUser(
        @Body() createUserDto: CreateUserDTO,
        @UploadedFile() file: Express.Multer.File,
    ): Promise<User> {
        return this.usersService.createUser(createUserDto, file);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({
        summary: "Update user details",
        description: "Updates user details (name, email, password) and optionally replaces the avatar file",
    })
    @ApiParam({ name: 'id', description: 'User ID', example: 1 })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'John Doe' },
                email: { type: 'string', example: 'john@example.com' },
                password: { type: 'string', example: 'secret123' },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Optional new user avatar file',
                },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'User updated successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    async updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDTO,
        @UploadedFile() file?: Express.Multer.File,
    ): Promise<User> {
        return this.usersService.updateUser(id, updateUserDto, file);
    }

    @Delete(':id')
    @ApiOperation({
        summary: "Delete user",
        description: "Deletes a user by ID and removes their avatar from Cloudinary",
    })
    @ApiParam({ name: 'id', description: 'User ID', example: 1 })
    @ApiResponse({ status: 200, description: 'User deleted successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    async deleteUser(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<{ message: string; deletedUser: User }> {
        return this.usersService.deleteUser(id);
    }
}