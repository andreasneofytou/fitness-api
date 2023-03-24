import { Roles } from '@app/auth/decorators/roles.decorator';
import { LocalUser } from '@app/auth/dto/local-user';
import { UserDto } from '@app/users/dto/user.dto';
import { User, UserRole } from '@app/users/entities/user.entity';
import { MapInterceptor } from '@automapper/nestjs';
import {
  Controller,
  Get,
  NotFoundException,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(MapInterceptor(User, UserDto))
  @ApiResponse({ type: UserDto })
  @Get('/self')
  async getSelf(@Request() { user: { id } }: { user: LocalUser }) {
    const user = await this.usersService.findOneOrThrow({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @UseInterceptors(MapInterceptor(User, UserDto, { isArray: true }))
  @ApiResponse({ type: UserDto })
  @Roles(UserRole.admin)
  @Get()
  async get() {
    const user = await this.usersService.findMany();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
