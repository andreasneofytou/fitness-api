import { PhoneNumberDto } from '@app/common/dto/phone-number.dto';
import { UserRole } from '@app/users/entities/user.entity';
import { AutoMap } from '@automapper/classes';

export class UserDto {
  @AutoMap()
  id: string;

  @AutoMap()
  username: string;

  givenName: string;

  surname: string;

  email?: string;

  phoneNumber?: PhoneNumberDto;

  @AutoMap()
  profilePictureUrl: string;

  @AutoMap(() => [String])
  roles: UserRole[];

  @AutoMap()
  isActivated: boolean;

  @AutoMap()
  isVerified: boolean;
}
