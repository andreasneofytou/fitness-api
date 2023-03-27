import { Exercise } from '@app/exercises/entities/exercise.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CustomExerciseDocument = CustomExercise & Document;

@Schema({ timestamps: true, id: true })
export class CustomExercise extends Exercise {
  @Prop()
  authorId: string;
}
export const CustomExerciseSchema =
  SchemaFactory.createForClass(CustomExercise);
