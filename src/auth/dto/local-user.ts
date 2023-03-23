import { LoginProvider } from '@app/common/enums/login-provider';
import { UserRole } from '@app/users/entities/user.entity';

export class LocalUser {
  username: string;
  id: string;
  roles: UserRole[];
  isVerified: boolean;
  isActivated: boolean;
  isCompleted: boolean;
  loginProvider: LoginProvider;
}
