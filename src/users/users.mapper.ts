import { RegisterDto } from '@app/auth/dto/register.dto';
import { CreateUserDto } from '@app/users/dto/create-user.dto';
import { UserDto } from '@app/users/dto/user.dto';
import { User } from '@app/users/entities/user.entity';

import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersMapper extends AutomapperProfile {
  constructor(@InjectMapper() public mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        User,
        UserDto,
        forMember(
          (u) => u.id,
          mapFrom((us) => us['_id']),
        ),
      );
      createMap(
        mapper,
        RegisterDto,
        CreateUserDto,
        forMember(
          (cud) => cud.username,
          mapFrom((rd) => rd.email),
        ),
      );
    };
  }
}
