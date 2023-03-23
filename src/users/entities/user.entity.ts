import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum UserRole {
  admin = 'admin',
  client = 'client',
}

export type UserDocument = User & Document;

@Schema({ timestamps: true, id: true })
export class User {
  @AutoMap()
  @Prop({ unique: true })
  username: string;

  @Prop()
  password: string;

  @Prop({ unique: true })
  email: string;

  @AutoMap(() => [String])
  @Prop({ type: [String], enum: UserRole })
  roles: UserRole[];

  @AutoMap()
  @Prop({ default: false })
  isActivated: boolean;

  @AutoMap()
  @Prop({ default: false })
  isVerified: boolean;

  @AutoMap()
  @Prop({ default: false })
  isCompleted: boolean;

  @AutoMap()
  @Prop()
  profilePictureUrl: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
