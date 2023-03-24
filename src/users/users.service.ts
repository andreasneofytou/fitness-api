import { CreateUserDto } from '@app/users/dto/create-user.dto';
import { User, UserDocument, UserRole } from '@app/users/entities/user.entity';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import * as crypto from 'crypto';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await hash(
      createUserDto.password ?? crypto.randomBytes(10).toString('hex'),
      10,
    );

    return await this.userModel.create({
      username: createUserDto.email,
      ...createUserDto,
    });
  }

  async findOneOrThrow({ id, roles }: UserQuery): Promise<User> {
    this.validateId(id);
    const query = { _id: id };
    if (roles && roles.length > 0) {
      query['roles'] = { $elemMatch: { $in: roles } };
    }
    return this.userModel.findOne(query);
  }

  async findByUsername(username: string): Promise<User> {
    const usernameRegex = username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return await this.userModel.findOne({
      username: { $regex: `^${usernameRegex}$`, $options: 'i' },
    });
  }

  async findMany(query?: UserQuery): Promise<User[]> {
    return this.userModel.find(query);
  }

  private validateId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      this.logger.error(`Invalid ID: ${id}`);
      throw new BadRequestException('Invalid ID');
    }
  }
}

export class UserQuery {
  id?: string;
  roles?: UserRole[];
}
