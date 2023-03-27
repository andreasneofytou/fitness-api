import { AllowAnonymous } from '@app/auth/decorators/allow-anonymous.decorator';
import { LocalUser } from '@app/auth/dto/local-user';
import { LoginDto } from '@app/auth/dto/login.dto';
import { RegisterDto } from '@app/auth/dto/register.dto';
import { TokenDto } from '@app/auth/dto/token.dto';
import { JwtRefreshGuard } from '@app/auth/guards/jwt-refresh.guard';
import { LoginProvider } from '@app/common/enums/login-provider';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
@AllowAnonymous()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: RegisterDto })
  @ApiResponse({ type: TokenDto })
  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return this.authService.login(user['_id']);
  }

  @ApiBody({ type: LoginDto })
  @ApiResponse({ type: TokenDto })
  @ApiUnauthorizedResponse()
  @Post('/login')
  async login(@Body() { username, password }: LoginDto) {
    const userId = await this.authService.validateUser(username, password);
    return this.authService.login(userId, LoginProvider.local);
  }

  @ApiBody({ type: LoginDto })
  @ApiResponse({ type: TokenDto })
  @UseGuards(JwtRefreshGuard)
  @ApiUnauthorizedResponse()
  @Get('/refresh')
  async refreshToken(
    @Request() { user: { id, loginProvider } }: { user: LocalUser },
  ) {
    return this.authService.login(id, loginProvider);
  }
}
