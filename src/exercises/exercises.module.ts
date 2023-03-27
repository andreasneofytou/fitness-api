import {
  Exercise,
  ExerciseSchema,
} from '@app/exercises/entities/exercise.entity';
import { ExercisesMapper } from '@app/exercises/exercises.mapper';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Exercise.name, schema: ExerciseSchema },
    ]),
  ],
  controllers: [ExercisesController],
  providers: [ExercisesService, ExercisesMapper],
})
export class ExercisesModule {}
