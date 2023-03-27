import {
  Equipment,
  ExerciseType,
  FormType,
  MuscleGroup,
} from '@app/exercises/entities/exercise.entity';
import { AutoMap } from '@automapper/classes';

export class ExerciseDto {
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  muscleGroup: MuscleGroup;

  @AutoMap()
  equipment: Equipment;

  @AutoMap()
  type: ExerciseType;

  @AutoMap()
  form: FormType;
}
