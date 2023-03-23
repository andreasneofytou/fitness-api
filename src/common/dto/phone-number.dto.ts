import { AutoMap } from '@automapper/classes';
import { IsNotEmpty } from 'class-validator';

export class PhoneNumberDto {
  @AutoMap()
  @IsNotEmpty()
  nationalNumber: string;

  @AutoMap()
  @IsNotEmpty()
  internationalNumber: string;

  @AutoMap()
  @IsNotEmpty()
  countryCode: string;

  @AutoMap()
  @IsNotEmpty()
  countryFlag: string;
}
