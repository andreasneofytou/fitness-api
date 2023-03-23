import { JwtConfig } from '@app/app.config';
import { LocalUser } from '@app/auth/dto/local-user';
import { TokenPayload } from '@app/auth/dto/token-payload';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const { secret } = configService.get<JwtConfig>('jwt');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: TokenPayload): LocalUser {
    if (!payload.isVerified) {
      throw new ForbiddenException('User not verified');
    }
    return {
      id: payload.sub,
      username: payload.username,
      roles: payload.roles,
      isActivated: payload.isActivated,
      isCompleted: payload.isCompleted,
      isVerified: payload.isVerified,
      loginProvider: payload.loginProvider,
    };
  }
}
