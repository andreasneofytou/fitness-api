import { PhoneNumberDto } from '@app/common/dto/phone-number.dto';
import { UserRole } from '@app/users/entities/user.entity';
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  @Length(2, 20)
  firstName: string;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  @Length(2, 20)
  lastName: string;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @AutoMap()
  @ApiProperty()
  @IsOptional()
  phoneNumber?: PhoneNumberDto;

  @AutoMap()
  @IsNotEmpty()
  @ApiProperty()
  @Length(8, 200)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d\W]*$/, {
    message: 'Password is too week',
  })
  password?: string;

  @AutoMap()
  @ApiProperty()
  @IsOptional()
  @IsUrl()
  profilePictureUrl?: string;

  @ApiProperty()
  @AutoMap()
  @IsOptional()
  username?: string;

  roles?: UserRole[];

  isActivated?: boolean;

  isVerified?: boolean;

  isCompleted?: boolean;
}
