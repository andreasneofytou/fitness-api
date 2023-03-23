import { JwtConfig } from '@app/app.config';
import { RegisterDto } from '@app/auth/dto/register.dto';
import { TokenPayload } from '@app/auth/dto/token-payload';
import { LoginProvider } from '@app/common/enums/login-provider';
import { UsersService } from '@app/users/users.service';
import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  private jwtConfig: JwtConfig;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.jwtConfig = configService.get<JwtConfig>('jwt');
  }

  async register(registerDto: RegisterDto) {
    return await this.usersService.create(registerDto);
  }

  async login(id: string, loginProvider: LoginProvider = LoginProvider.local) {
    const user = await this.usersService.findOneOrThrow({ id });
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload: TokenPayload = {
      username: user.username,
      sub: user['_id'],
      roles: user.roles,
      isVerified: user.isVerified,
      isActivated: user.isActivated,
      isCompleted: user.isCompleted,
      loginProvider: loginProvider,
      profilePictureUrl: user.profilePictureUrl,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(
      { sub: user['_id'], loginProvider: loginProvider },
      {
        secret: this.jwtConfig.refreshTokenSecret,
        expiresIn: this.jwtConfig.refreshTokenExpiration,
      },
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(username: string, password: string): Promise<string> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      this.logger.debug('Could not find user');
      throw new NotFoundException();
    }
    const isPasswordMatch = await compare(password, user.password);
    return isPasswordMatch ? user['_id'] : undefined;
  }
}
