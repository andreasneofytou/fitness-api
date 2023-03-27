import {
  Equipment,
  ExerciseType,
  FormType,
  MuscleGroup,
} from '@app/exercises/entities/exercise.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(MuscleGroup)
  muscleGroup: MuscleGroup;

  @IsEnum(Equipment)
  equipment: Equipment;

  @IsEnum(ExerciseType)
  type: ExerciseType;

  @IsEnum(FormType)
  form: FormType;

  @ApiHideProperty()
  @Exclude()
  authorId?: string;
}
