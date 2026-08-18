import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { CreateUserDTO } from "./dto/createUser.dto";
import { UpdateUserDTO } from "./dto/updateUser.dto";
import { UsersRepository } from "./users.repository";
import { User } from "./entities/user.entity";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { UserRole } from "./enums/role.enum";

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    async createUser(createUserDTO: CreateUserDTO, file: Express.Multer.File): Promise<User> {
        if (!file) {
            throw new BadRequestException("Avatar file is required");
        }

        const uploadResult = await this.cloudinaryService.uploadFile(file);

        if (!uploadResult || !('secure_url' in uploadResult)) {
            throw new InternalServerErrorException("Failed to upload avatar image to Cloudinary");
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(createUserDTO.password, saltRounds);

        return this.usersRepository.createUser(
            {
                ...createUserDTO,
                password: hashedPassword,
            },
            {
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
            },
        );
    }

    async findAllUsers(): Promise<User[]> {
        return this.usersRepository.findAllUsers();
    }

    async findUserById(id: number): Promise<User> {
        const user = await this.usersRepository.findUserById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async updateUser(
        id: number,
        updateUserDTO: UpdateUserDTO,
        currentUser: any,
        file?: Express.Multer.File,
    ): Promise<User> {
        if (currentUser.role !== UserRole.ADMIN && currentUser.sub !== id) {
            throw new ForbiddenException('You can only update your own profile');
        }

        if (currentUser.role !== UserRole.ADMIN && updateUserDTO.role) {
            throw new ForbiddenException('Only administrators can modify user roles');
        }

        const existingUser = await this.usersRepository.findUserById(id);
        if (!existingUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        let newAvatar: { url: string; public_id: string } | undefined;

        if (file) {
            const uploadResult = await this.cloudinaryService.uploadFile(file);
            if (!uploadResult || !('secure_url' in uploadResult)) {
                throw new InternalServerErrorException("Failed to upload new avatar image to Cloudinary");
            }
            newAvatar = {
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
            };

            if (existingUser.avatar_public_id) {
                try {
                    await this.cloudinaryService.deleteFile(existingUser.avatar_public_id);
                } catch (e) {
                    console.warn(`Failed to delete old avatar ${existingUser.avatar_public_id} from Cloudinary`, e);
                }
            }
        }

        let hashedPassword = updateUserDTO.password;
        if (updateUserDTO.password) {
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(updateUserDTO.password, saltRounds);
        }

        const updatedUser = await this.usersRepository.updateUser(
            id,
            {
                ...updateUserDTO,
                ...(hashedPassword ? { password: hashedPassword } : {}),
            },
            newAvatar,
        );

        if (!updatedUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return updatedUser;
    }

    async deleteUser(id: number): Promise<{ message: string; deletedUser: User }> {
        const existingUser = await this.usersRepository.findUserById(id);
        if (!existingUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        if (existingUser.avatar_public_id) {
            try {
                await this.cloudinaryService.deleteFile(existingUser.avatar_public_id);
            } catch (e) {
                console.warn(`Failed to delete avatar ${existingUser.avatar_public_id} from Cloudinary`, e);
            }
        }

        const deletedUser = await this.usersRepository.deleteUser(id);
        if (!deletedUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return { message: "User deleted successfully", deletedUser };
    }
}