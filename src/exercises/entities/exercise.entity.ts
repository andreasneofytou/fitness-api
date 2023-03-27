import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum FormType {
  time = 'time',
  distanceAndTime = 'distanceAndTime',
  reps = 'reps',
  weightAndReps = 'weightAndReps',
}

export enum Equipment {
  barbell = 'barbell',
  dumbbell = 'dumbbell',
  bodyweight = 'bodyweight',
  assistedBodyweight = 'assistedBodyweight',
  cable = 'cable',
  machine = 'machine',
  kettlebell = 'kettlebell',
  ball = 'ball',
  battleRope = 'battleRope',
  skippingRope = 'skippingRope',
  band = 'band',
  smithMachine = 'smithMachine',
}

export enum MuscleGroup {
  chest = 'chest',
  forearms = 'forearms',
  lats = 'lats',
  middleBack = 'middleBack',
  lowerBack = 'lowerBack',
  neck = 'neck',
  quadriceps = 'quadriceps',
  hamstrings = 'hamstrings',
  calves = 'calves',
  triceps = 'triceps',
  traps = 'traps',
  shoulders = 'shoulders',
  abdominals = 'abdominals',
  glutes = 'glutes',
  biceps = 'biceps',
  adductors = 'adductors',
  abductors = 'abductors',
  fullBody = 'fullBody',
}

export enum ExerciseType {
  strength = 'strength',
  cardio = 'cardio',
}

export type ExerciseDocument = Exercise & Document;

@Schema({ timestamps: true, id: true })
export class Exercise {
  @AutoMap()
  @Prop()
  name: string;

  @AutoMap()
  @Prop()
  muscleGroup: MuscleGroup;

  @AutoMap()
  @Prop()
  equipment: Equipment;

  @AutoMap()
  @Prop()
  type: ExerciseType;

  @AutoMap()
  @Prop()
  form: FormType;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
