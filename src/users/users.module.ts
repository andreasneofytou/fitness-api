import { User, UserSchema } from '@app/users/entities/user.entity';
import { UsersMapper } from '@app/users/users.mapper';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersMapper],
  exports: [UsersService],
})
export class UsersModule {}
