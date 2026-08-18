import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../users/dto/createUser.dto';
import { SignInDto } from './dto/signIn.dto';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { ApiGetProfileDocs, ApiSignInDocs, ApiSignOutDocs, ApiSignUpDocs } from './swagger/auth.swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  private setTokenCookie(res: Response, token: string) {
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 3600 * 1000,
    });
  }

  @Post('signup')
  @ApiSignUpDocs()
  @UseInterceptors(FileInterceptor('file'))
  async signUp(
    @Body() createUserDto: CreateUserDTO,
    @UploadedFile() file: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ user: User }> {
    const { user, accessToken } = await this.authService.signUp(createUserDto, file);
    this.setTokenCookie(res, accessToken);
    return { user };
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiSignInDocs()
  @UseInterceptors(NoFilesInterceptor())
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ user: User }> {
    const { user, accessToken } = await this.authService.signIn(signInDto);
    this.setTokenCookie(res, accessToken);
    return { user };
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  @ApiSignOutDocs()
  async signOut(@Res({ passthrough: true }) res: Response): Promise<{ message: string }> {
    res.clearCookie('access_token');
    return this.authService.signOut();
  }

  @Get('me')
  @ApiGetProfileDocs()
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: any) {
    return user;
  }
}
