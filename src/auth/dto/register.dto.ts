import { PhoneNumberDto } from '@app/common/dto/phone-number.dto';
import { AutoMap } from '@automapper/classes';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @AutoMap()
  @IsNotEmpty()
  @Length(1, 100)
  firstName: string;

  @AutoMap()
  @IsNotEmpty()
  @Length(1, 100)
  lastName: string;

  @AutoMap()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @AutoMap()
  @IsOptional()
  phoneNumber?: PhoneNumberDto;

  @AutoMap()
  @IsNotEmpty()
  @Length(8, 200)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d\W]*$/, {
    message: 'Password is too week',
  })
  password: string;

  @AutoMap()
  @IsOptional()
  @IsUrl()
  profilePictureUrl: string;
}
