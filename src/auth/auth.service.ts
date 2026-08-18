import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { CreateUserDTO } from '../users/dto/createUser.dto';
import { SignInDto } from './dto/signIn.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(
    createUserDto: CreateUserDTO,
    file: Express.Multer.File,
  ): Promise<{ user: User; accessToken: string }> {
    const existingUser = await this.usersRepository.findUserByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.usersService.createUser(createUserDto, file);
    const accessToken = await this.generateJwtToken(user);

    return { user, accessToken };
  }

  async signIn(signInDto: SignInDto): Promise<{ user: User; accessToken: string }> {
    const userWithPassword = await this.usersRepository.findUserByEmail(signInDto.email);
    if (!userWithPassword || !userWithPassword.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(signInDto.password, userWithPassword.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password, ...user } = userWithPassword;
    const accessToken = await this.generateJwtToken(user as User);

    return { user: user as User, accessToken };
  }

  async signOut(): Promise<{ message: string }> {
    return { message: 'User signed out successfully' };
  }

  private async generateJwtToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    return this.jwtService.signAsync(payload);
  }
}
