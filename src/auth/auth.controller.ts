import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/user/user.entity';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@Req() req: Request) {
    const userId = req['user']['sub'];
    const refreshToken = req['user']['refreshToken'];
    console.log('refreshToken', refreshToken);

    const user = await this.authService.updateRefreshTokens(
      userId,
      refreshToken,
    );
    delete user.password;

    return user;
  }

  @UseGuards(JwtGuard)
  @Get('logout')
  async logout(@Req() req: Request) {
    const userId = req['user']['id'];
    const role = req['role'];
    await this.authService.updateRefreshTokens(userId, '');
    return 1;
  }

  @UseGuards(JwtGuard)
  @Get('fetch')
  fetch(@GetUser('') user: User) {
    return user;
  }
}
